
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'process';
import { Observable, of } from 'rxjs';
import { tap, mapTo, catchError } from 'rxjs/operators';
import { SecurityModel, TokenApiModel } from 'src/app/models/secutiry.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_TOKEN = 'todoBearerTokenFlex';
  private readonly REFRESH_TOKEN = 'refreshTokenFlex';
  private loggedUser: string;
  //todoBearerToken  refreshToken
  constructor(private http: HttpClient) {}

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {


    const credentials=new TokenApiModel();

    const token: string = localStorage.getItem("todoBearerTokenFlex");
    const refreshToken: string = localStorage.getItem("refreshTokenFlex");
    credentials.AccessToken=token;
    credentials.RefreshToken=refreshToken;

    return this.http.post<any>( `${environment.APIEndpoint}/User/Refresh`,credentials ).pipe(tap((tokens: SecurityModel) => {
      this.storeJwtToken(tokens.BearerToken);
    }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  // private doLoginUser(username: string, tokens: Tokens) {
  //   this.loggedUser = username;
  //   this.storeTokens(tokens);
  // }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: SecurityModel) {
    localStorage.setItem(this.JWT_TOKEN, tokens.BearerToken);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.RefreshToken);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
