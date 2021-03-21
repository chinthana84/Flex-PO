import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridService } from 'src/app/grid/grid-service/grid.service';
import { GridOptions, GridType } from 'src/app/grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/grid/gridModels/searchObject.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {

  edited: boolean = false;

//  select cast(ApprovalGroupID as varchar) as ApprovalGroupID ,Name,cast(Caps as varchar) Caps,Status from ApprovalGroups
   gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.ApprovalGroups
      , defaultSortColumnName: "ApprovalGroupID",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "Name", colText: ' Name' },
      { colName: "Caps", colText: 'Caps' }
      ]
    }
  } || null;
  constructor( private activatedRoute: ActivatedRoute,private gridService :GridService,private confirmDialogService : ConfirmDialogService) { }

  ngOnInit(): void {
    this.setPage(this.gridOption.searchObject?? {} );
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {

      }
      else{

      }
    });
  }

  setPage(obj: SearchObject) {
    this.gridService.getGridData(obj).subscribe((data) => {
     this.gridOption.datas = data;
   }, (error) => {
     this.confirmDialogService.messageBox(environment.APIerror)
   });
 }

 Add(obj:any){
   this.gridOption.datas.pagedItems.push({})
 }

}
