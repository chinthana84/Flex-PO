import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from './po/po.module';
import { UserModule } from './user/user.module';
import { MySharedModule } from './myShared/my-shared.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GridModule } from './grid/grid.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    GridModule,
    UserModule,
    PoModule,
    MySharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
