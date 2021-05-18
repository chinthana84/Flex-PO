
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { SearchObject } from '../gridModels/searchObject.model';
import { GridService } from '../grid-service/grid.service';
import { Grid } from '../gridModels/grid.model';
import { GridOptions } from '../gridModels/gridOption.model';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css']
})
export class PagerComponent implements OnInit {
  @Input() pagerX : GridOptions = {};

  searchObject:SearchObject={};

  @Output()
  pagedClicked :EventEmitter<any>=new EventEmitter<any>();


  uploadComplete(pageno:number) {
debugger
    // this.gridService.currentData.subscribe(x => this.searchObject = x)
    // this.searchObject.pageNo=pageno;
    //  this.searchObject.girdId=this.pagerX.searchObject?.girdId;
    //  this.searchObject.defaultSortColumnName=this.pagerX.searchObject?.defaultSortColumnName;
    //  this.searchObject.aseOrDesc=this.pagerX.searchObject.aseOrDesc;
    // this.pagedClicked.emit(this.searchObject);

debugger
this.gridoption.searchObject.pageNo=pageno;
this.gridService.reloadGrid(this.gridoption)

  }

  gridoption:GridOptions={};

  constructor(private gridService:GridService) {



   }

  ngOnInit() {
    this.gridService.getGridOptions().subscribe(r=>{
      debugger
      this.gridoption=r;
    });

  }

}
