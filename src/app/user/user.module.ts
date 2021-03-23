import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { ApprovalComponent } from "./admin/approval/approval.component";
import { GridModule } from "../grid/grid.module";
import { FormsModule } from "@angular/forms";
import { MySharedModule } from "../myShared/my-shared.module";
import { ApprovalUsersComponent } from "./admin/approval-users/approval-users.component";
import { NgSelectModule } from "@ng-select/ng-select";

const routes: Routes = [
  {
    path: "login", data: { titleKey: "request" }, component: LoginComponent,
  },
  {
    path: "approvalGroups", data: { titleKey: "approvalGroups" }, component: ApprovalComponent,
  },
  {
    path: "approvalGroupsUsers", data: { titleKey: "approvalGroupsUsers" }, component: ApprovalUsersComponent,
  },
  {
    path: "home", data: { titleKey: "request" }, component: HomeComponent,
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent,
    ApprovalComponent,
    ApprovalUsersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    GridModule,
    MySharedModule,
  ],
})
export class UserModule { }
