import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { GridOptions, GridType } from 'src/app/grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/grid/gridModels/searchObject.model';
import { SupplierDTO, RefTableDTO, ItemsDTO } from 'src/app/models/refTable.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/myShared/services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {


  private subs = new SubSink();
  model: ItemsDTO = {};
  edited: boolean = false;
  statusList: RefTableDTO[] = [];
  unitList: RefTableDTO[] = [];

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.Item
      , SavedDBColumn: "Name"
      , defaultSortColumnName: "Name",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "Name", colText: 'Name' }
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
        let x = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'ROW_STATUS');
        let y = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'UNITS');

        forkJoin([x, y]).subscribe((data) => {
          this.statusList = data[0];
          this.unitList = data[1];
        }, (error) => {
          this.confirmDialogService.messageBox(environment.APIerror)
        });

      } else if (params.id > 0) {
        this.edited = true;
        let x = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'ROW_STATUS');
        let y = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'UNITS');
        let z = this.http.get<ItemsDTO>(`${environment.APIEndpoint}/Admin/GetItemByID/` + params.id );
        forkJoin([x, y,z]).subscribe((data) => {
          this.statusList = data[0];
          this.unitList = data[1];
          this.model=data[2];
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
    debugger
    if (item == undefined) {
      this.router.navigate(["/items/edit"], { queryParams: { id: 0 } });
    } else {
      this.router.navigate(["/items/edit"], {
        queryParams: { id: item.ItemId },
      });
    }
    this.edited = true;
  }

  onSubmit(obj: SupplierDTO) {
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/Admin/SaveItem`, obj, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)

        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['items']);
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
