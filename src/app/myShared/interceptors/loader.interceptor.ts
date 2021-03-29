import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoaderService } from "../services/loader.service";


@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(public loaderService: LoaderService) { }
    // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     this.loaderService.show();
    //     return next.handle(req).pipe(
    //         finalize(() => this.loaderService.hide())
    //     );
    // }

    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {

      this.loaderService.show();

      if (localStorage.getItem("todoBearerTokenFlex")) {

        const headerSettings: {[name: string]: string | string[]; } = {};

       if(request.url.split('/')[request.url.split('/').length-1]==="UploadFile"){
        for (const key of request.headers.keys()) {
          headerSettings[key] = request.headers.getAll(key);
        }
      //  headerSettings['Content-Type'] = 'multipart/form-data';
        // headerSettings['Accept'] = 'application/json';

      //  headerSettings['Content-Type'] = 'application/json';

       }
       else{
        for (const key of request.headers.keys()) {
          headerSettings[key] = request.headers.getAll(key);
        }
        headerSettings['Content-Type'] = 'application/json';

       }




        const newHeader = new HttpHeaders(headerSettings);

        headerSettings['Authorization'] = 'Bearer ' + localStorage.getItem("todoBearerTokenFlex");
        request = request.clone({

          setHeaders:  headerSettings

        });
      }
      this.loaderService.show();
              return next.handle(request).pipe(
            finalize(() => this.loaderService.hide())
        );
    }

  }
