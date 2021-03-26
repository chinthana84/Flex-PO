import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { GridService } from 'src/app/grid/grid-service/grid.service';
import { GridOptions, GridType } from 'src/app/grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/grid/gridModels/searchObject.model';
import { DepartmentsDTO, DepWrapper, RefTableDTO, SecurityGroupsDTO } from 'src/app/models/refTable.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-departmetns',
  templateUrl: './departmetns.component.html',
  styleUrls: ['./departmetns.component.css']
})

//select cast(DepartmentID as varchar) as ApprovalGroupID ,DepartmentName, RefTables.RefDescription as Status, StatusRefID
export class DepartmetnsComponent implements OnInit {
  edited: boolean = false;
  statusList: RefTableDTO[] = [];
  model: DepartmentsDTO = {};
  securtyGroups: SecurityGroupsDTO[] = [];

  checkedSecutiryGroups: SecurityGroupsDTO[] = [];

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Departments
      , defaultSortColumnName: "DepartmentID",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "DepartmentName", colText: ' DepartmentName' }
      ]
    }
  };


  constructor(public route: ActivatedRoute, private toasterService: ToastrService, private router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute, private gridService: GridService, private confirmDialogService: ConfirmDialogService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id == 0) {
        this.edited = true;
      } else if (params.id > 0) {
        this.edited = true;
      } else {
        this.setPage(this.gridOption.searchObject ?? {});
        this.edited = false;
      }

      let a = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'ROW_STATUS');
      let b = this.http.get<SecurityGroupsDTO[]>(`${environment.APIEndpoint}/Admin/GetAllSecurityGroups`);

      forkJoin([a, b]).subscribe(results => {
        this.statusList = results[0]
        this.securtyGroups = results[1];

        if (params.id > 0) {
          let x = this.http.get<DepartmentsDTO>(`${environment.APIEndpoint}/Admin/GetDepartmentByID/` + params.id);
          let y = this.http.get<SecurityGroupsDTO[]>(`${environment.APIEndpoint}/Admin/GetAllSecurityGroupsByDeparmentid/` + params.id);
          forkJoin([x, y]).subscribe((data) => {
            debugger
            this.model = data[0];
            this.checkedSecutiryGroups = data[1];
          }, (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });
        }
        else if(params.id==0){
          let y = this.http.get<SecurityGroupsDTO[]>(`${environment.APIEndpoint}/Admin/GetAllSecurityGroupsByDeparmentid/` + params.id);
          forkJoin([y]).subscribe((data) => {
            debugger

            this.checkedSecutiryGroups = data[0];
            this.model={};
          }, (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });
        }
      },
        (error) => {
          this.confirmDialogService.messageBox(environment.APIerror);
        });
    });
  }


  setPage(obj: SearchObject) {
    this.gridService.getGridData(obj).subscribe((data) => {
      this.gridOption.datas = data;
    }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });
  }

  Action(obj: any) {
    debugger
    if (obj == undefined) {
      this.router.navigate(['/departments/edit'], { queryParams: { id: 0 } });
    }
    else {
      this.router.navigate(['/departments/edit'], { queryParams: { id: obj.DepartmentId } });
    }
    this.edited = true
  }


  Save() {
    debugger
    let obj: DepWrapper = {};
    obj.dep = this.model;
    obj.lstSecutiryGropp = this.checkedSecutiryGroups;

    this.http
      .post<any>(`${environment.APIEndpoint}/Admin/SaveDepartments`, obj, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          debugger
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toasterService.show("SSS");
          this.router.navigate(['departments']);

        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });
  }



}
