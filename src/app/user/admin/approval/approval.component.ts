import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { GridService } from 'src/app/grid/grid-service/grid.service';
import { GridOptions, GridType } from 'src/app/grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/grid/gridModels/searchObject.model';
import { RefTableDTO } from 'src/app/models/refTable.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {

  statusList: RefTableDTO[] = [];
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
  };


  constructor(public route: ActivatedRoute,private toasterService:ToastrService, private router:Router, private http: HttpClient, private activatedRoute: ActivatedRoute, private gridService: GridService, private confirmDialogService: ConfirmDialogService) { }

  ngOnInit(): void {

    this.http.get<any>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'ROW_STATUS')
      .subscribe((data) => {
        this.statusList = data;
         this.setPage(this.gridOption.searchObject ?? {}); }
        , (error) => {
          this.confirmDialogService.messageBox(environment.APIerror)
        });




    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {

      }
      else {

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

  Add(obj: any) {
    this.gridOption.datas.pagedItems.push({})
  }

  Save(obj: any) {
debugger
    this.http
      .post<any>(`${environment.APIEndpoint}/Admin/SaveApprovalGroups`, obj, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          debugger
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
            this.toasterService.show("SSS");
            this.router.navigate(['venue']);
            this.setPage(this.gridOption.searchObject?? {});
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });

  }

  redirectToApprovalUsers(groupid:string){
     this.router.navigate(['approvalGroupsUsers'] , { queryParams: { id: groupid } }  )
  }

}
