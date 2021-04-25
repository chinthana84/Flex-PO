import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyDepartmentsComponent } from './my-departments/my-departments.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonService } from '../myShared/services/common.service';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule } from '../grid/grid.module';
import { MySharedModule } from '../myShared/my-shared.module';

const routes: Routes = [

  {
    path: new CommonService().GetAllNavigations().myDepartments,  data: { titleKey: 'myDepartments' }, component: MyDepartmentsComponent
   , children: [{ path: 'edit', component: MyDepartmentsComponent } ]
  }]

@NgModule({
  declarations: [MyDepartmentsComponent],
  imports: [

    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgSelectModule,
    GridModule,
    MySharedModule,
    NgbModule
  ]
})
export class MyworksModule { }
