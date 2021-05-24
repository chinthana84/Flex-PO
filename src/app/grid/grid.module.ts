import { Grid2Service } from './grid-service/grid2.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { PagerComponent } from './pager/pager.component';
import { Grid } from "./gridModels/Grid";
import { SearchObject } from './gridModels/searchObject.model';
import { GridOptions } from './gridModels/gridOption.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridService } from './grid-service/grid.service';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [SearchComponent,PagerComponent  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule
  ],

  exports:[SearchComponent ,PagerComponent]
  , providers:[GridService,Grid2Service]
})
export class GridModule { }
