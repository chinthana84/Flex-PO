import { PrService } from './../../myShared/services/pr.service';
import { PoviewComponent } from './../poview/poview.component';
import { Grid2Service } from './../../grid/grid-service/grid2.service';
import { GridService } from 'src/app/grid/grid-service/grid.service';
import { LoaderService } from './../../myShared/services/loader.service';
import { RefTableDTO } from 'src/app/models/refTable.model';
import { ItemService } from './../../myShared/services/item.service';
import { PurchaseRequestAttachmentsDTO, PurchaseRequestDetailDTO } from './../../models/purchaseRequestHeaderDTO.model';
import { SupplierDTO } from './../../models/refTable.model';
import { TypeHeadSearchDTO } from './../../grid/gridModels/typeheadSearch.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { GridOptions, GridType, PO_Status } from 'src/app/grid/gridModels/gridOption.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { TypeheadService } from 'src/app/myShared/services/typehead.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { purchaseRequestHeaderDTO } from 'src/app/models/purchaseRequestHeaderDTO.model';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/myShared/services/common.service';
import { environment } from 'src/environments/environment';
import { FileuploadService } from 'src/app/myShared/services/fileupload.service';
import { PoitemComponent } from '../poitem/poitem.component';
import { ApprovalOfficersDTO } from 'src/app/models/secutiry.model';
import { Grid3Service } from 'src/app/grid/grid-service/grid3.service';
import { POViewNewComponent } from '../poview-new/poview-new.component';


@Component({
  selector: 'app-purchase-request',
  templateUrl: './purchase-request.component.html',
  styleUrls: ['./purchase-request.component.css']
})
export class PurchaseRequestComponent implements OnInit, OnDestroy {


  public myEnum = PO_Status;

  private subs = new SubSink();
  edited: boolean = false;
  modelPR: purchaseRequestHeaderDTO = {};
  modelSupplier: SupplierDTO = {};
  modelShiptTo: RefTableDTO[] = [];
  loggedUserDepartments: any[] = [];

  officers: [ApprovalOfficersDTO[]] = [[]];

  mode: string = "";

  setReadOnly: Boolean = false;

  model: any;
  searching = false;
  searchFailed = false;
  formatter = (x: TypeHeadSearchDTO) => x.Name
  formatterx = (x: TypeHeadSearchDTO) => x.Name;

  SelectedPRID: number = 0;

  selectedSummaryID: number = 0;

  gridOption: GridOptions = {
    gridID: "a",

    datas: {},
    searchObject: {
      girdId: GridType.PR
      , SavedDBColumn: "SupplierID"
      , defaultSortColumnName: "PONo",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "PONo", colText: 'PONo' },
      { colName: "DepartmentName", colText: 'Department' }
        , { colName: "SupplierName", colText: 'Supplier' }
        , { colName: "ShipTo", colText: 'ShipTo' }
        , { colName: "POStatus", colText: 'PRStatus' }
      ]
      , postatusid: "0"
    }
  };

  gridOption2: GridOptions = {
    gridID: "b",
    datas: {},
    searchObject: {
      girdId: GridType.PR
      , SavedDBColumn: "SupplierID"
      , defaultSortColumnName: "PONo",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "PONo", colText: 'PONo' },
      { colName: "DepartmentName", colText: 'Department' }

      ]
    }
  };


  closeResult: string;

  constructor(
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private confirmDialogService: ConfirmDialogService,
    private typeheadService: TypeheadService,
    private http: HttpClient,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private itemService: ItemService,
    public commonService: CommonService,
    public fileuploadService: FileuploadService,
    public gridService: GridService,
    public gridService2: Grid2Service,
    public gridService3: Grid3Service,
    public prService: PrService
  ) {
    this.edited = false;

  }

  ngOnInit(): void {
    debugger



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

    //  this.gridService.initGrid(this.gridOption) ;
    //  this.gridService2.initGrid(this.gridOption2) ;

    this.gridService3.initGridNew(this.gridOption);
    this.gridService3.initGridNew(this.gridOption2);

    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {


      if (params.id == 0) {
        this.NewPR();
      } else if (params.id > 0) {
        this.EditPR(params.id);
      } else {
        this.edited = false;
        this.gridService3.initGridNew(this.gridOption);
        //this.gridService2.initGrid(this.gridOption2) ;


      }
    });
  }

  DepaertmentChange() {
    this.http.get<any>(`${environment.APIEndpoint}/PurchaseRequest/GetApprovalOfficersList/${this.GetTotal()}/${1}/${this.modelPR.DepartmentId}`).subscribe(r => {
      this.officers = r;

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


           this.http.get<any>(`${environment.APIEndpoint}/PurchaseRequest/GetApprovalOfficersList/${this.GetTotal()}/${1}/${this.modelPR.DepartmentId}`).subscribe(r => {
        this.officers = r;

      });

      if (isCopy) {
        this.mode = "Copy PR";
        this.modelPR.PoheaderId = 0;
        this.modelPR.Pono = "";
        this.modelPR.PoStatusRefId = 0;
        this.modelPR.PoStatusRef = null;
        this.modelPR.AssignedToMeUserId = 0;
        this.modelPR.PurchaseOrderApproval = [];
        this.modelPR.PurchaseRequestDetail.forEach(r => {
          r.PoheaderId = 0;
          r.PodetId = 0;
          r.ReceviedQty = 0;
          r.PoOrderReceivedRefId = 0
          r.guid = this.commonService.newGuid();
        });

        this.modelPR.PurchaseRequestAttachments.forEach(r => {
          r.PoheaderId = 0;
          r.Id = 0;
        });

        this.modelPR.PurchaseRequestDetail.forEach(r => {
          r.PrdetailsAttachments.forEach(s => {
            s.PodetId = 0;
            s.PrdetAttachmentId = 0;
          })
        });


      }

    }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
  }

  NewPR() {
    this.mode = "New";
    this.edited = true;
    this.modelPR = new purchaseRequestHeaderDTO();
    this.model = new TypeHeadSearchDTO();
    this.officers = [[]];


    this.subs.sink = this.http.get<any>(`${environment.APIEndpoint}/Admin/LoggedUsersDeparmnts`)
      .subscribe((data) => { this.loggedUserDepartments = data; }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });

    this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'Ship To').subscribe(
      r => { this.modelShiptTo = r; }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
  }


  SetReadOnlyFuction() {
    debugger
    if (this.modelPR.PoStatusRefId == undefined || this.modelPR.PoStatusRefId == 0 || this.modelPR.PoStatusRefId == 27 || this.modelPR.PoStatusRefId == 66) {
     return false;
    }
    else {
      return true;
    }
  }

  ViewOnly(Id: number) {
    this.router.navigate(["/request/edit"], { queryParams: { id: Id } });
    this.EditPR(Id, false);
  }

  Action(item: any) {

    if (item == undefined) {
      this.router.navigate(["/request/edit"], { queryParams: { id: 0 } });
    } else {
      this.router.navigate(["/request/edit"], { queryParams: { id: item.Id } });
    }
    this.edited = true;
  }

  openXl(content, event) {
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

  IsShowSave() {
    if (this.modelPR.PoStatusRefId == 27 || this.modelPR.PoStatusRefId == 0 || this.modelPR.PoStatusRefId == 66) {
      return true;
    }
    return false;
  }

  Save() {
    this.modelPR.PoStatusRefId = 27; //raised po
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/PurchaseRequest/SavePurchaseRequest`, this.modelPR, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages);
          this.modelPR.PoStatusRefId = 0;
        }
        else {
          this.gridService3.initGridNew(this.gridOption)
          this.edited = false;
          this.router.navigate(['request']);
          this.gridService.initGrid(this.gridOption);
          this.toastr.success(environment.dataSaved);
        }
      }, (error) => { this.modelPR.PoStatusRefId = 0; this.confirmDialogService.messageBox(environment.APIerror) });
  }

  SaveDrafts() {
    this.modelPR.PoStatusRefId = 66; //drafts
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/PurchaseRequest/SavePurchaseRequest`, this.modelPR, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
          this.modelPR.PoStatusRefId = 0;
        }
        else {
          this.edited = false;
          this.router.navigate(['request']);
          this.gridService.initGrid(this.gridOption);
          this.toastr.success(environment.dataSaved);
        }
      }, (error) => { this.modelPR.PoStatusRefId = 0; this.confirmDialogService.messageBox(environment.APIerror) });
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

  copyPR(id: number) {
    this.router.navigate(["/request/edit"], { queryParams: { id: 0 } });
    this.EditPR(id, true);
  }

  GetTotal() {
    let sum = 0;
    this.modelPR?.PurchaseRequestDetail?.forEach(r => sum += r.UnitPrice * r.Qty);
    return sum;
  }

  ViewPO(id: number, $event) {
    // this.http.get<any>(`${environment.APIEndpoint}/PurchaseRequest/GetPoEmail/${id}`).subscribe(r => {
    //   const modalRef = this.modalService.open(PoviewComponent, { size: 'xl' });
    //   modalRef.componentInstance.fromParent = r; });

    this.http.get<any>(`${environment.APIEndpoint}/PurchaseRequest/ViewPOByPrID/${this.modelPR.PoheaderId}`).subscribe(r => {
      const modalRef = this.modalService.open(POViewNewComponent, { size: 'xl' });
      modalRef.componentInstance.poFROMPARANT = r;
    });
  }

  ClickSummary() {
    this.gridOption.searchObject.postatusid = this.selectedSummaryID.toString()
    this.gridService3.initGridNew(this.gridOption);
  }

  Cancel(id: number) {
    debugger
    this.confirmDialogService.confirmThis("Are you sure to Cancel?", () => {
      debugger
      this.modelPR = new purchaseRequestHeaderDTO();
      this.modelPR.PoheaderId = id;
      this.subs.sink = this.http
        .post<any>(`${environment.APIEndpoint}/PurchaseRequest/Cancel`, this.modelPR, {}).subscribe((data) => {
          if (data.IsValid == false) {
            this.confirmDialogService.messageListBox(data.ValidationMessages)
          }
          else {
            this.toastr.success(environment.dataSaved);
            this.router.navigate(['request']);
          }
        }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
    }, function () { });
  }

  Receving(id: number) {
    this.router.navigate(["/request/edit"], { queryParams: { id: id } }).then(r => { });
  }

  OrderReceveDrodown(item: any) {
    if (item.PoOrderReceivedRefId == this.myEnum.Order_Receievd_in_Full) {
      item.ReceviedQty = item.Qty;
    }
    else {
      item.ReceviedQty = 0;
    }
  }

  saveRecevedItems(det: PurchaseRequestDetailDTO) {
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/PurchaseRequest/RecevingOrderItem`, det, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          if (data.SavedID > 0) { this.router.navigate(['request']); }
          // this.router.navigate(['request']);
        }
      }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
