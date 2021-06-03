import { Grid2Service } from './../grid-service/grid2.service';
import { Subject } from 'rxjs';
import { GridOptions } from 'src/app/grid/gridModels/gridOption.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridService } from '../grid-service/grid.service';
import { Grid } from '../gridModels/grid.model';
import { SearchObject } from '../gridModels/searchObject.model';
import { Grid3Service } from '../grid-service/grid3.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  gridoption: GridOptions = {};
  gridoption2: GridOptions = {};

  searchColumn?: string = '';
  searchColumn2?: string = '';

  searchText?: string = '';

  selectedSummaryID: string = "";
  selectedSummaryID2: string = "";

  @Input()
  serviceID?: number = 0;

  @Input()
  searchID: number = 0;

  @Input()
  assosiatedGridIDXXX: string="";



  constructor(private gridService: GridService, private gridSercie2: Grid2Service, private gridSercie3: Grid3Service) {

  }

  searchClickNew(obj: any, s: string = "") {
    this.gridoption.searchObject.pageNo = 1;
    this.gridoption.searchObject.searchColName = obj;
    this.gridoption.searchObject.searchText = this.searchText;
    //this.gridoption.searchObject.postatusid = this.selectedSummaryID;

    this.gridSercie3.initGridNew(this.gridoption);

    // if (this.serviceID == 2) {
    //   this.gridoption2.searchObject.pageNo = 1;
    //   this.gridoption2.searchObject.searchColName = obj;
    //   this.gridoption2.searchObject.searchText = this.searchText;
    //   this.gridoption2.searchObject.postatusid = this.selectedSummaryID2;

    //   this.gridSercie2.reloadGrid(this.gridoption2);
    // } else {

    //   this.gridoption.searchObject.pageNo = 1;
    //   this.gridoption.searchObject.searchColName = obj;
    //   this.gridoption.searchObject.searchText = this.searchText;
    //   this.gridoption.searchObject.postatusid = this.selectedSummaryID;

    //   this.gridService.reloadGrid(this.gridoption);
    // }


  }



  ngOnInit() {

    // this.gridService.getGridOptions().subscribe(r => {

    //   this.gridoption = r;
    //   this.searchColumn = this.gridoption.searchObject.colNames[0].colName;

    // });

    // this.gridSercie2.getGridOptions().subscribe(r => {

    //   this.gridoption2 = r;
    //   this.searchColumn2 = this.gridoption2.searchObject.colNames[0].colName;

    // });

   this.gridSercie3.getGridOptionsXXX().subscribe(r => {
      if(r!= undefined && r.filter(a=> a.gridID == this.assosiatedGridIDXXX).length>0)
      {
        this.gridoption = r.filter(r=> r.gridID==this.assosiatedGridIDXXX)[0];
        this.searchColumn = this.gridoption.searchObject.colNames[0].colName;
      }
    });

  }

  ChangeSearch() {
    // if (this.serviceID == 2) {

    // }
    // else{

    // }
    // sessionStorage.setItem("filterid", this.selectedSummaryID.toString())

    // document.getElementById("button1id100").click();

  }

}
