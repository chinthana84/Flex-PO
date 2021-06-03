import { PrService } from './../../myShared/services/pr.service';
import { GridService } from 'src/app/grid/grid-service/grid.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { GridOptions, GridType, PO_Status } from 'src/app/grid/gridModels/gridOption.model';
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
import { PoviewComponent } from 'src/app/po/poview/poview.component';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {

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

  public myEnum = PO_Status;

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.MyTasks
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
    public gridService: GridService,
    public prService:PrService
  ) { this.edited = false; }

  ngOnInit(): void {
    this.subs.sink = this.itemService.itemAdded().subscribe(r => {
      if (this.modelPR.PurchaseRequestDetail == undefined) {
        this.modelPR.PurchaseRequestDetail = [];
      }
      if (this.modelPR.PurchaseRequestDetail.filter(x => x.guid == r.guid).length > 0) {
        this.modelPR.PurchaseRequestDetail = this.modelPR.PurchaseRequestDetail.filter(x => x.guid != r.guid);
        this.modelPR.PurchaseRequestDetail.push(r);
      } else {
        this.modelPR.PurchaseRequestDetail.push(r);
      }
    });

    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id > 0) {
        this.EditPR(params.id);
      } else {
        this.gridService.initGrid(this.gridOption);
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
    this.router.navigate(["/MyTasks/edit"], { queryParams: { id: Id } });
    this.EditPR(Id, false);
  }

  Action(item: any) {
    if (item == undefined) {
      this.router.navigate(["/MyTasks/edit"], { queryParams: { id: 0 } });
    } else {
      this.router.navigate(["/MyTasks/edit"], { queryParams: { id: item.Id } });
    }
    this.edited = true;
  }

  openXl(content) {
    const modalRef = this.modalService.open(PoitemComponent, { size: 'xl' });
  }

  editPoDetaisls(obj: PurchaseRequestDetailDTO) {
    const modalRef = this.modalService.open(PoitemComponent, { size: 'xl' });
    modalRef.componentInstance.fromParent = obj;
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.typeheadService.search(term).pipe(
          tap(() => {
            this.searchFailed = false;
          }),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )

  selectedItem(item: any) {
    this.subs.sink = this.http.get<any>(`${environment.APIEndpoint}/Admin/GetSupplierByID/` + item.item.ID)
      .subscribe((data) => { this.modelSupplier = data; this.modelPR.SupplierId = item.item.ID; }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
  }

  deleteItem(index: PurchaseRequestDetailDTO) {
    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {
      if (index.PodetId > 0) {
        this.modelPR.PurchaseRequestDetail = this.modelPR.PurchaseRequestDetail.filter(r => r.ItemId != index.ItemId);
      } else {
        this.modelPR.PurchaseRequestDetail = this.modelPR.PurchaseRequestDetail.filter(r => r.guid != index.guid);
      }
    }, function () { });
  }

  Save() {
    this.modelPR.PoStatusRefId = this.myEnum.AssigedToMe; //assinged to me to small changes to request
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/PurchaseRequest/SaveByFinanace`, this.modelPR, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.edited = false;
          this.router.navigate(['MyTasks']);
          this.gridService.initGrid(this.gridOption);
          this.toastr.success(environment.dataSaved);
        }
      }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
  }

  createPO() {
   // this.modelPR.PoStatusRefId = this.myEnum.CreatePO;
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/PurchaseRequest/CreatePO`, this.modelPR, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['MyTasks']);
          this.gridService.initGrid(this.gridOption);
        }
      }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
  }

  createPOEmail() {
   // this.modelPR.PoStatusRefId = this.myEnum.PO_Raised_Via_emial;
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/PurchaseRequest/CreatePOWithEmail`, this.modelPR, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['MyTasks']);
          this.gridService.initGrid(this.gridOption);
        }
      }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
  }

  Approve() {
    this.confirmDialogService.confirmThis("Are you sure to APPROVE?", () => {
      this.subs.sink = this.http
        .post<any>(`${environment.APIEndpoint}/PurchaseRequest/ApprovRequest`, this.modelPR, {}).subscribe((data) => {
          if (data.IsValid == false) {
            this.confirmDialogService.messageListBox(data.ValidationMessages)
          }
          else {
            this.toastr.success(environment.dataSaved);
            //this.router.navigate(['MyTasks']);
            location.reload();
          }
        }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
    }, function () { });
  }

  Reject() {
    this.confirmDialogService.confirmThis("Are you sure to REJECT?", () => {
      this.subs.sink = this.http
        .post<any>(`${environment.APIEndpoint}/PurchaseRequest/RejectRequest`, this.modelPR, {}).subscribe((data) => {
          if (data.IsValid == false) {
            this.confirmDialogService.messageListBox(data.ValidationMessages)
          }
          else {
            this.toastr.success(environment.dataSaved);
            this.router.navigate(['MyTasks']);
          }
        }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
    }, function () { });
  }

  AddRowAttachemtns() {
    let obj = new PurchaseRequestAttachmentsDTO();
    this.modelPR.PurchaseRequestAttachments.push(obj);
  }

  addFile(event, i: PurchaseRequestAttachmentsDTO): void {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      this.fileuploadService
        .upload(file).subscribe(res => { i.UniqueFileName = String(res); });
    }
  }

  deleteFile(id: number) {
    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {
      this.modelPR.PurchaseRequestAttachments = this.modelPR.PurchaseRequestAttachments.filter(item => item.Id != id);
    }, function () { });
  }

  GetTotal() {
    let sum = 0;
    this.modelPR?.PurchaseRequestDetail?.forEach(r => sum += r.UnitPrice * r.Qty);
    return sum;
  }

  RaisePO() {
    let self = this;
    this.confirmDialogService.confirmThis("Do you want to raise a PO?", () => {
      this.confirmDialogService.confirmThis("Send the PO via email?", () => {
        self.createPOEmail();
      }, function () {
        self.createPO();
      });
    }, function () { });
  }


  POPreview(){
    this.http.get<any>(`${environment.APIEndpoint}/PurchaseRequest/GetPOBeforeSave/${this.modelPR.PoheaderId}`).subscribe(r => {
      const modalRef = this.modalService.open(PoviewComponent, { size: 'xl' });
      modalRef.componentInstance.fromParent = r; });
  }

  Paying(){
    this.subs.sink = this.http
    .post<any>(`${environment.APIEndpoint}/PurchaseRequest/Paid`, this.modelPR, {}).subscribe((data) => {
      if (data.IsValid == false) {
        this.confirmDialogService.messageListBox(data.ValidationMessages)
      }
      else {
        this.toastr.success(environment.dataSaved);
        this.router.navigate(['MyTasks']);
      }
    }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
  }

  Completed(){

    this.confirmDialogService.confirmThis("Do you want to complete this PO?", () => {
      this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/PurchaseRequest/Completed`, this.modelPR, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['MyTasks']);
        }
      }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
    }, function () { });

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
