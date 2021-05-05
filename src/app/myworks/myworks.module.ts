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
import { MyTasksComponent } from './my-tasks/my-tasks.component';

const routes: Routes = [

  {
    path: new CommonService().GetAllNavigations().myDepartments,  data: { titleKey: 'My Departments' }, component: MyDepartmentsComponent , children: [{ path: 'edit', component: MyDepartmentsComponent } ]
  },
  {
    path: new CommonService().GetAllNavigations().myTasks,  data: { titleKey: 'My Tasks' }, component: MyTasksComponent , children: [{ path: 'edit', component: MyTasksComponent } ]
  }
]

@NgModule({
  declarations: [MyDepartmentsComponent, MyTasksComponent],
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
