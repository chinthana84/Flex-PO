import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from './po/po.module';
import { UserModule } from './user/user.module';
import { MySharedModule } from './myShared/my-shared.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GridModule } from './grid/grid.module';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderInterceptor } from './myShared/interceptors/loader.interceptor';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { NgbDateAdapter, NgbDateNativeAdapter, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    GridModule,
    UserModule,
    PoModule,
    MySharedModule,
    ToastrModule.forRoot(),
    NgbModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent }
    ]),


  ],
  exports:[],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
    ,{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
