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

    this.gridService.currentData.subscribe(x => this.searchObject = x)
    this.searchObject.pageNo=pageno;
     this.searchObject.girdId=this.pagerX.searchObject?.girdId;
     this.searchObject.defaultSortColumnName=this.pagerX.searchObject?.defaultSortColumnName;
     this.searchObject.aseOrDesc=this.pagerX.searchObject.aseOrDesc;
    this.pagedClicked.emit(this.searchObject);

  }

  constructor(private gridService:GridService) { }

  ngOnInit() {}

}
