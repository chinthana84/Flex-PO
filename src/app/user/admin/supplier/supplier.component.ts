import { RefTableDTO, SupplierDTO } from './../../../models/refTable.model';
import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { GridOptions, GridType } from 'src/app/grid/gridModels/gridOption.model';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SearchObject } from 'src/app/grid/gridModels/searchObject.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/myShared/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {

  private subs = new SubSink();
  model: SupplierDTO = {};
  edited: boolean = false;
  statusList: RefTableDTO[] = [];

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Supplier
      , SavedDBColumn: "SupplierID"
      , defaultSortColumnName: "SupplierName",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "SupplierName", colText: 'Name' },
      { colName: "Contact", colText: 'Contact' }
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
        this.model ={};

        this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'ROW_STATUS').subscribe(
          r=>{this.statusList=r;},  (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });


      } else if (params.id > 0) {
        this.edited = true;
        this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'ROW_STATUS').subscribe(
          r=>{this.statusList=r;},  (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });

        this.subs.sink = this.http
          .get<any>(`${environment.APIEndpoint}/Admin/GetSupplierByID/` + params.id)
          .subscribe((data) => { this.model = data; }, (error) => {
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
    debugger
    if (item == undefined) {
      this.router.navigate(["/supplier/edit"], { queryParams: { id: 0 } });
    } else {
      this.router.navigate(["/supplier/edit"], {
        queryParams: { id: item.SupplierId },
      });
    }
    this.edited = true;
  }

  onSubmit(obj: SupplierDTO) {
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/Admin/SaveSupplier`, obj, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)

        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['supplier']);
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
