import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ApprovalComponent } from './admin/approval/approval.component';
import { GridModule } from '../grid/grid.module';

const routes: Routes = [
  {
    path: 'login',data:{titleKey: 'request'}, component: LoginComponent

  },{
    path: 'approvalGroups',data:{titleKey: 'approvalGroups'}, component: ApprovalComponent
  },{
    path: 'home',data:{titleKey: 'request'}, component: HomeComponent
  }
];

@NgModule({
  declarations: [LoginComponent, HomeComponent, ApprovalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GridModule
  ]
})
export class UserModule { }
