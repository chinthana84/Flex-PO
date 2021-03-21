import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseRequestComponent } from './purchase-request/purchase-request.component';
import { RouterModule, Routes } from '@angular/router';
import { GridModule } from '../grid/grid.module';

const routes: Routes = [
  {
    path: 'request',data:{titleKey: 'request'}, component: PurchaseRequestComponent
    , children: [{ path: 'edit', component: PurchaseRequestComponent }]
  }
];

@NgModule({
  declarations: [PurchaseRequestComponent],

  imports: [
    CommonModule,
    GridModule,
    RouterModule.forChild(routes)
  ]
})
export class PoModule { }
