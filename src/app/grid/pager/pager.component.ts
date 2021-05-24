
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { SearchObject } from '../gridModels/searchObject.model';
import { GridService } from '../grid-service/grid.service';
import { Grid } from '../gridModels/grid.model';
import { GridOptions } from '../gridModels/gridOption.model';
import { Grid2Service } from '../grid-service/grid2.service';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css']
})
export class PagerComponent implements OnInit {
  @Input()
  serviceID?: number = 0;
  gridoption: GridOptions = {};
  gridoption2: GridOptions = {};





  uploadComplete(pageno: number) {


    debugger

    if (this.serviceID == 2) {
      this.gridoption2.searchObject.pageNo = pageno;
      this.gridService2.reloadGrid(this.gridoption2)
    } else {
      this.gridoption.searchObject.pageNo = pageno;
      this.gridService.reloadGrid(this.gridoption)
    }
  }



  constructor(private gridService: GridService, private gridService2: Grid2Service) {



  }

  ngOnInit() {
    this.gridService.getGridOptions().subscribe(r => {
      debugger
      this.gridoption = r;
    });

    this.gridService2.getGridOptions().subscribe(r => {
      debugger
      this.gridoption2 = r;
    });

  }

}
