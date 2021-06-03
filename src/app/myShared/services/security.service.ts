import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Login, SecurityModel } from 'src/app/models/secutiry.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private _securityModel2 = new BehaviorSubject<SecurityModel>(new SecurityModel());
  currentSecurityObject = this._securityModel2.asObservable();

 //private logger = new Subject<boolean>();

  constructor(private http: HttpClient,
    private router: Router) { }

    // isLoggedIn(){
    //   if (localStorage.getItem("authenticated")=="1")
    //   {
    //     this.logger.next(true);

    //   }

    // }

    public LoginPage(){
      this._securityModel2.next(new SecurityModel() );
    }

  public Login(userForm: Login): Observable<SecurityModel> {

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http
      .post<SecurityModel>(
        `${environment.APIEndpoint}/User/Login`,
        userForm,
        httpOptions
      )
      .pipe( tap((result) => {
        var m : any=result;
        var u: any=userForm;
      //  Object.assign(m, result);
        //Now check if Authenticated is true store token in sessionStorage
        if (m.IsAuthenticated) {

          this._securityModel2.next(m);
          localStorage.setItem("authenticatedFlex","1");
          localStorage.setItem("todoBearerTokenFlex",m.BearerToken);
          localStorage.setItem("refreshTokenFlex",m.RefreshToken);
          localStorage.setItem(
            "usernameFlex",
            u.UserName
          )
          // localStorage.setItem(
          //   "pwFlex",
          //   u.Password
          // )
        } else {
          this._securityModel2.next(new SecurityModel() );
        }
      })
      );
  }

  public logout() {

    localStorage.removeItem("todoBearerTokenFlex");
    localStorage.removeItem("usernameFlex");
    localStorage.removeItem("pwFlex");
    localStorage.removeItem("usernameFlex");
    localStorage.removeItem("authenticatedFlex");
    localStorage.removeItem("refreshTokenFlex");
    this._securityModel2.next(new SecurityModel() );

    this.router.navigate(['login']);
  }
  

}

