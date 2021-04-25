import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { GridOptions, GridType } from 'src/app/grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/grid/gridModels/searchObject.model';
import { TypeHeadSearchDTO } from 'src/app/grid/gridModels/typeheadSearch.model';
import { purchaseRequestHeaderDTO, PurchaseRequestDetailDTO, PurchaseRequestAttachmentsDTO } from 'src/app/models/purchaseRequestHeaderDTO.model';
import { SupplierDTO, RefTableDTO } from 'src/app/models/refTable.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/myShared/services/common.service';
import { FileuploadService } from 'src/app/myShared/services/fileupload.service';
import { ItemService } from 'src/app/myShared/services/item.service';
import { TypeheadService } from 'src/app/myShared/services/typehead.service';
import { PoitemComponent } from 'src/app/po/poitem/poitem.component';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-my-departments',
  templateUrl: './my-departments.component.html',
  styleUrls: ['./my-departments.component.css']
})
export class MyDepartmentsComponent implements OnInit {

  private subs = new SubSink();
  edited: boolean = false;
  modelPR: purchaseRequestHeaderDTO = {};
  modelSupplier: SupplierDTO = {};
  modelShiptTo: RefTableDTO[] = [];
  loggedUserDepartments: any[] = [];

  mode: string = "";

  model: any;
  searching = false;
  searchFailed = false;
  formatter = (x: TypeHeadSearchDTO) => x.Name
  formatterx = (x: TypeHeadSearchDTO) => x.Name;

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.AssignedToME
      , SavedDBColumn: "SupplierID"
      , defaultSortColumnName: "PONo",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "PONo", colText: 'PONo' },
      { colName: "DepartmentName", colText: 'Department' }
        , { colName: "SupplierName", colText: 'Supplier' }
        , { colName: "ShipTo", colText: 'ShipTo' }
      ]
    }
  };
  closeResult: string;

  constructor(private modalService: NgbModal, private confirmDialogService: ConfirmDialogService, private typeheadService: TypeheadService
    , private http: HttpClient,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private itemService: ItemService,
    public commonService: CommonService,
    public fileuploadService: FileuploadService
  ) { this.edited = false; }

  ngOnInit(): void {

    this.setPage(this.gridOption.searchObject);

   }

  EditPR(id: number, isCopy: Boolean = false) {
    this.edited = true;
    this.mode = "Edit";

    let x = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/LoggedUsersDeparmnts`);
    let y = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'Ship To');
    let z = this.http.get<any>(`${environment.APIEndpoint}/PurchaseRequest/GetPurchaseRequestByID/` + id);
    forkJoin([x, y, z]).subscribe((data) => {
      this.loggedUserDepartments = data[0];
      this.modelShiptTo = data[1];
      this.modelPR = data[2];
      this.modelSupplier = data[2].Supplier;
      this.modelPR.SupplierId = data[2].SupplierId;
      this.modelPR.Podate = new Date(this.modelPR.Podate);

      if (isCopy) {
        this.mode = "Copy PR";
        this.modelPR.PoheaderId = 0;
        this.modelPR.Pono = "";
        this.modelPR.PoStatusRefId = 0;
        this.modelPR.PoStatusRef = null;
        this.modelPR.PurchaseOrderApproval = [];
        this.modelPR.PurchaseRequestDetail.forEach(r => {
          r.PoheaderId = 0;
          r.PodetId = 0;
          r.guid = this.commonService.newGuid();
        });

        this.modelPR.PurchaseRequestAttachments.forEach(r => {
          r.PoheaderId = 0;
          r.Id = 0;
        });
      }

    }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
  }


  ViewOnly(Id: number) {
    this.router.navigate(["/MyDeps/edit"], { queryParams: { id: Id } });
    this.EditPR(Id, false);
  }

  setPage(obj: SearchObject) {
    this.subs.sink = this.http.post<any>(`${environment.APIEndpoint}/grid`, obj, {})
      .subscribe((data) => {
        this.gridOption.datas = data;
        if(this.gridOption.datas.pagedItems ==0 )
        {
          this.gridOption.datas.pagedItems =[];
        }
      }, (error) => { this.confirmDialogService.messageBox(environment.APIerror); });


  }

  Action(item: any) {

      this.router.navigate(["/MyDeps/edit"], { queryParams: { id: item.Id } });

    this.edited = true;
  }



  Save() {



    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/PurchaseRequest/AssignedToMe`, this.modelPR, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['MyDeps']);
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
  }


  AssignToMe(id:number=0) {
    debugger
    this.modelPR=new purchaseRequestHeaderDTO();
    this.modelPR.PoheaderId=id;
    this.confirmDialogService.confirmThis("Are you sure ?", () => {
      this.Save();
    }, function () { });
  }






  GetTotal() {
    let sum = 0;

    this.modelPR?.PurchaseRequestDetail?.forEach(r => sum += r.UnitPrice * r.Qty);

    return sum;

  }
}