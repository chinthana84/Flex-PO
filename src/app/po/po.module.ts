import { UserModule } from './../user/user.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseRequestComponent } from './purchase-request/purchase-request.component';
import { RouterModule, Routes } from '@angular/router';
import { GridModule } from '../grid/grid.module';
import { NgbDate, NgbDateAdapter, NgbModule, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PoitemComponent } from './poitem/poitem.component';
import { MySharedModule } from '../myShared/my-shared.module';
import { PurchaseRequestApprovalComponent } from './purchase-request-approval/purchase-request-approval.component';
import { AmmendPoComponent } from './ammend-po/ammend-po.component';
import { PoheaderComponent } from './poheader/poheader.component';
import { PodetailsComponent } from './podetails/podetails.component';
import { GrnComponent } from './grn/grn.component';
import { ApprovalFlowComponent } from './approval-flow/approval-flow.component';

const routes: Routes = [
  {
    path: 'request', data: { titleKey: 'Request' }, component: PurchaseRequestComponent
    , children: [{ path: 'edit', component: PurchaseRequestComponent }]
  }, {
    path: 'requestapproval', data: { titleKey: 'Approval' }, component: PurchaseRequestApprovalComponent
    , children: [{ path: 'edit', component: PurchaseRequestApprovalComponent }]
  }, {
    path: 'ammendPO', data: { titleKey: 'PO Ammend' }, component: AmmendPoComponent
    , children: [{ path: 'edit', component: AmmendPoComponent }]
  }
  , {
    path: 'grn', data: { titleKey: 'GRN' }, component: GrnComponent
    , children: [{ path: 'edit', component: GrnComponent }]
  }
];

@NgModule({
  declarations: [PurchaseRequestComponent, PoitemComponent, PurchaseRequestApprovalComponent, AmmendPoComponent, PoheaderComponent, PodetailsComponent, GrnComponent, ApprovalFlowComponent],

  imports: [
    CommonModule,
    GridModule,
    FormsModule,
    NgbModule,
    UserModule,
    MySharedModule,
    NgSelectModule,
    RouterModule.forChild(routes)
  ]
  , providers: [

    //{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}
  ],
})
export class PoModule { }
