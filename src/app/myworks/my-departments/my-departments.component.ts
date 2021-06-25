import { PrService } from 'src/app/myShared/services/pr.service';
import { GridService } from 'src/app/grid/grid-service/grid.service';
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
import { UserDetails } from 'src/app/models/secutiry.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/myShared/services/common.service';
import { FileuploadService } from 'src/app/myShared/services/fileupload.service';
import { ItemService } from 'src/app/myShared/services/item.service';
import { TypeheadService } from 'src/app/myShared/services/typehead.service';
import { PoitemComponent } from 'src/app/po/poitem/poitem.component';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { Grid3Service } from 'src/app/grid/grid-service/grid3.service';
import { AuthService } from 'src/app/myShared/services/auth.service';

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

  modelPRList: purchaseRequestHeaderDTO[] = [];

  mode: string = "";

  model: any;
  searching = false;
  searchFailed = false;
  formatter = (x: TypeHeadSearchDTO) => x.Name
  formatterx = (x: TypeHeadSearchDTO) => x.Name;

  userDetaills: UserDetails[] = [];
  selectedUserID: number = 0;

  gridOption: GridOptions = {
    gridID: "MyWorksMydepartment",
    datas: {},
    searchObject: {
      girdId: GridType.LockedbyFinance
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
    public fileuploadService: FileuploadService,
    public gridService3: Grid3Service,
    public authService: AuthService,
    public prService:PrService
  ) { this.edited = false; }

  ngOnInit(): void {


    this.selectedUserID = parseInt(this.authService.DecodeJWT().UserID);
    this.getallUsers();
    debugger
    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {
      debugger
      if (params.id > 0) {
        this.EditPR(params.id);
        this.getallUsers();
      } else {
        debugger
        this.gridService3.initGridNew(this.gridOption);
        this.edited = false;
      }
    });

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



  Action(item: any) {

    this.router.navigate(["/MyDeps/edit"], { queryParams: { id: item.Id } });

    this.edited = true;
  }



  Save() {


    this.modelPRList.forEach(r=>{
      r.AssignedToMeUserId=this.selectedUserID;
    });

    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/PurchaseRequest/AssignedToMe`, this.modelPRList, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.edited = false;
          debugger
          this.router.navigate(['MyDeps']);
          location.reload()
        }
      }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
  }

  // Save2() {
  //   this.modelPR.AssignedToMeUserId = this.selectedUserID;
  //   this.subs.sink = this.http
  //     .post<any>(`${environment.APIEndpoint}/PurchaseRequest/AssignedToMe`, this.modelPR, {}).subscribe((data) => {
  //       if (data.IsValid == false) {
  //         this.confirmDialogService.messageListBox(data.ValidationMessages)
  //       }
  //       else {
  //         this.edited = false;
  //         this.toastr.success(environment.dataSaved);
  //         this.router.navigate(['MyDeps']);
  //       }
  //     }, (error) => {

  //       this.confirmDialogService.messageBox(environment.APIerror)
  //     });
  // }



  AssignToMe() {
    this.confirmDialogService.confirmThis("Are you sure ?", () => {
      this.Save();
    }, function () { });
  }


  getallUsers() {
    this.http.get<any>(`${environment.APIEndpoint}/Admin/GetAllUsers`)
      .subscribe((data) => { this.userDetaills = data; }, (error) => { this.confirmDialogService.messageBox(environment.APIerror); });
  }



  GetTotal() {
    let sum = 0;
    this.modelPR?.PurchaseRequestDetail?.forEach(r => sum += r.UnitPrice * r.Qty);
    return sum;
  }

  SelectItemToAssign(e, obj: any) {
    debugger
    if (e.target.checked) {
      let o = new purchaseRequestHeaderDTO();
      o.PoheaderId = obj.PoheaderId;
      this.modelPRList.push(o);
    }
    else{
      this.modelPRList=this.modelPRList.filter(r=> r.PoheaderId!= obj.PoheaderId);
    }
  }
}
