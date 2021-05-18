import { Subject } from 'rxjs';
import { GridOptions } from 'src/app/grid/gridModels/gridOption.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridService } from '../grid-service/grid.service';
import { Grid } from '../gridModels/grid.model';
import { SearchObject } from '../gridModels/searchObject.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  gridoption: GridOptions={};

  dropDonwDefautlSelected = 1;

    searchColumn? :string= '';
    searchText?:string = '';

  @Input()
  searchOptionsX?: any = {};

  @Input()
     search  :  SearchObject ={colNames: []=[]};

  @Input()
  searchID: number=0;


  @Output()
  searchClicked: EventEmitter<any> = new EventEmitter<any>();

  selectedSummaryID:string="";

  constructor(private gridService: GridService) { }

  searchClickNew(obj:any,s:string=""){
    // const x: SearchObject = {
    //   pageNo: 1,
    //   searchColName: obj ,//this.searchColumn,
    //   searchText: this.searchText,
    //   defaultSortColumnName:this.search?.defaultSortColumnName,
    //   girdId:this.search?.girdId,
    //   postatusid:this.selectedSummaryID
    // };
debugger
    this.gridoption.searchObject.pageNo=1;
    this.gridoption.searchObject.searchColName=obj;
    this.gridoption.searchObject.searchText=this.searchText;
   // this.gridoption.searchObject.defaultSortColumnName=this.search?.defaultSortColumnName;
    //this.gridoption.searchObject.girdId=this.search?.girdId;
    this.gridoption.searchObject.postatusid=this.selectedSummaryID;

    this.gridService.reloadGrid(this.gridoption);
  }

  searchClick(obj: any, s: string="") {
    const x: SearchObject = {
      pageNo: 1,
      searchColName: obj ,//this.searchColumn,
      searchText: this.searchText,
      defaultSortColumnName:this.search?.defaultSortColumnName,
      girdId:this.search?.girdId,
      postatusid:this.selectedSummaryID
    };
    // this.gridService.updateMessage(x);
    // this.searchClicked.emit(x);
  }

  ngOnInit() {

    this.gridService.getGridOptions().subscribe(r=>{
      debugger
      this.gridoption=r;
      this.searchColumn = this.gridoption.searchObject.colNames[0].colName;
      console.log(r)
    });

    // if(this.search?.colNames){
    //   debugger

    //   // this.searchColumn = this.search.colNames[0].colName;
    // }else
    // {
    //   this.searchColumn = ""
    // }


  }

  ChangeSearch(){
    sessionStorage.setItem("filterid",this.selectedSummaryID.toString())

    document.getElementById("button1id100").click();

  }

}
