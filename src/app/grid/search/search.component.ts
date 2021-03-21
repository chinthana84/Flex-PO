import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridService } from '../grid-service/grid.service';
import { Grid } from '../gridModels/grid.model';
import { SearchObject } from '../gridModels/searchObject.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

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

  constructor(private gridService: GridService) { }
  searchClick(obj: any, s: string="") {
    const x: SearchObject = {
      pageNo: 1,
      searchColName: obj ,//this.searchColumn,
      searchText: this.searchText,
      defaultSortColumnName:this.search?.defaultSortColumnName,
      girdId:this.search?.girdId

    };
    this.gridService.updateMessage(x);
    this.searchClicked.emit(x);
  }

  ngOnInit() {
    if(this.search?.colNames){
      this.searchColumn = this.search.colNames[0].colName;
    }else
    {
      this.searchColumn = ""
    }


  }

}
