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
import { DepartmetnsComponent } from './admin/departmetns/departmetns.component';
import { RefTablesComponent } from './admin/ref-tables/ref-tables.component';
import { CommonService } from "../myShared/services/common.service";

const routes: Routes = [
  {
    path: "login", data: { titleKey: "request" }, component: LoginComponent,
  },
  {
    path: new CommonService().GetAllNavigations().approvalGroups, data: { titleKey: "approvalGroups" }, component: ApprovalComponent,
  },
  {
    path: "approvalGroupsUsers", data: { titleKey: "approvalGroupsUsers" }, component: ApprovalUsersComponent,
  }
  ,
  {
    path: "masterData", data: { titleKey: "masterData" }, component: RefTablesComponent,
  }
  ,
  {
    path: "departments", data: { titleKey: "departments" }, component: DepartmetnsComponent,
       children: [{ path: 'edit', component: DepartmetnsComponent }]
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
    DepartmetnsComponent,
    RefTablesComponent,
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
