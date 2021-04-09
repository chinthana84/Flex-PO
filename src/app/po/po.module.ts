import { UserModule } from './../user/user.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseRequestComponent } from './purchase-request/purchase-request.component';
import { RouterModule, Routes } from '@angular/router';
import { GridModule } from '../grid/grid.module';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PoitemComponent } from './poitem/poitem.component';

const routes: Routes = [
  {
    path: 'request',data:{titleKey: 'request'}, component: PurchaseRequestComponent
    , children: [{ path: 'edit', component: PurchaseRequestComponent }]
  }
];

@NgModule({
  declarations: [PurchaseRequestComponent, PoitemComponent],

  imports: [
    CommonModule,
    GridModule,
    FormsModule,
    NgbModule,
    UserModule,
    NgSelectModule,
    RouterModule.forChild(routes)
  ]
})
export class PoModule { }
