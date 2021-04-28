import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, finalize, switchMap, take } from "rxjs/operators";
import { LoaderService } from "../services/loader.service";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { SecurityModel } from "src/app/models/secutiry.model";


@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService,private router: Router,private loaderService :LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     
    this.loaderService.show();
    if (this.authService.getJwtToken()) {
      request = this.addToken(request, this.authService.getJwtToken());
    }

    return  next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
      } else {
        //  this.router.navigate(['login']);
        return throwError(error);
      }
    })).pipe(
      finalize(() => this.loaderService.hide()))
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private isRefreshing = false;
private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

  if (!this.isRefreshing) {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);
    console.log("token refresing....")
    return this.authService.refreshToken().pipe(
      switchMap((token: SecurityModel) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(token.BearerToken);
        return next.handle(this.addToken(request, token.BearerToken));
      }));

  } else {
    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(jwt => {
        return next.handle(this.addToken(request, jwt));
      }));
  }
}

  }
