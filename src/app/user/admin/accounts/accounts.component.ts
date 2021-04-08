import { AccountListDTO, RefTableDTO, SupplierDTO } from './../../../models/refTable.model';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridOptions, GridType } from 'src/app/grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/grid/gridModels/searchObject.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/myShared/services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  private subs = new SubSink();
  model: AccountListDTO = {};
  edited: boolean = false;
  statusList: RefTableDTO[] = [];
  accountTypeList: RefTableDTO[] = [];

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.AccountList
      , SavedDBColumn: "ID"
      , defaultSortColumnName: "ID",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "AccountCode", colText: 'AccountCode' },
      { colName: "AccountName", colText: 'AccountName' }
      ]
    }
  };

  constructor(
    private http: HttpClient,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService,
    public commonService: CommonService
  ) {
    this.edited = false;
  }

  ngOnInit() {
    this.setPage(this.gridOption.searchObject);

    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {

      if (params.id == 0) {
        this.edited = true;
        this.model = {};

        this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'ROW_STATUS').subscribe(
          r => { this.statusList = r; }, (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });


        this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'ACCOUNT_TYPES').subscribe(
          r => { this.accountTypeList = r; }, (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });


      } else if (params.id > 0) {
        this.edited = true;

        let x = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'ROW_STATUS');

        let y = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'ACCOUNT_TYPES');

        let z = this.http
          .get<any>(`${environment.APIEndpoint}/Admin/GetAccountListByID/` + params.id);

        forkJoin([x, y, z]).subscribe((data) => {
           
          this.statusList = data[0];
          this.accountTypeList = data[1];
          this.model = data[2];
        }, (error) => {
          this.confirmDialogService.messageBox(environment.APIerror)
        });


      } else {
        this.edited = false;
      }
    });
  }

  setPage(obj: SearchObject) {
    this.subs.sink = this.http.post<any>(`${environment.APIEndpoint}/grid`, obj, {})
      .subscribe((data) => {
        this.gridOption.datas = data;
        this.gridOption.searchObject.saveID = 0;
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror);

      });
  }


  Action(item: any) {

    if (item == undefined) {
      this.router.navigate(["/AccountList/edit"], { queryParams: { id: 0 } });
    } else {
      this.router.navigate(["/AccountList/edit"], {
        queryParams: { id: item.Id },
      });
    }
    this.edited = true;
  }

  onSubmit(obj: AccountListDTO) {
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/Admin/SaveAccountList`, obj, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)

        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['AccountList']);
          this.gridOption.searchObject.saveID = data.SavedID;
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)

        //this.errorHandler.handleError(error);

      });
  }



  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
