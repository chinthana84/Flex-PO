import { AccountListDTO } from './../models/refTable.model';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ApprovalComponent } from './admin/approval/approval.component';
import { GridModule } from '../grid/grid.module';
import { FormsModule } from '@angular/forms';
import { MySharedModule } from '../myShared/my-shared.module';
import { ApprovalUsersComponent } from './admin/approval-users/approval-users.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DepartmetnsComponent } from './admin/departmetns/departmetns.component';
import { RefTablesComponent } from './admin/ref-tables/ref-tables.component';
import { CommonService } from '../myShared/services/common.service';
import { SupplierComponent } from './admin/supplier/supplier.component';
import { ItemsComponent } from './admin/items/items.component';
import { AccountsComponent } from './admin/accounts/accounts.component';

const routes: Routes = [
  {
    path: 'login',
    data: { titleKey: 'Request' },
    component: LoginComponent,
  },
  {
    path: new CommonService().GetAllNavigations().approvalGroups,
    data: { titleKey: 'ApprovalGroups' },
    component: ApprovalComponent,
  },
  {
    path: 'approvalGroupsUsers',
    data: { titleKey: 'ApprovalGroupsUsers' },
    component: ApprovalUsersComponent,
  },
  {
    path: 'masterData',
    data: { titleKey: 'MasterData' },
    component: RefTablesComponent,
  },
  {
    path: 'departments',
    data: { titleKey: 'Departments' },
    component: DepartmetnsComponent,
    children: [{ path: 'edit', component: DepartmetnsComponent }],
  },
  {
    path: new CommonService().GetAllNavigations().supplier,
    data: { titleKey: 'Supplier' },
    component: SupplierComponent,
    children: [{ path: 'edit', component: SupplierComponent }],
  },
  {
    path: new CommonService().GetAllNavigations().items,
    data: { titleKey: 'Item' },
    component: ItemsComponent,
    children: [{ path: 'edit', component: ItemsComponent }],
  },
  {
    path: new CommonService().GetAllNavigations().accountList,
    data: { titleKey: 'accountList' },
    component: AccountsComponent,
    children: [{ path: 'edit', component: AccountsComponent }],
  },
  {
    path: 'home',
    data: { titleKey: 'home' },
    component: HomeComponent,
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
    SupplierComponent,
    ItemsComponent,
    AccountsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    GridModule,
    MySharedModule,
  ],
  exports: [SupplierComponent]
})
export class UserModule { }
