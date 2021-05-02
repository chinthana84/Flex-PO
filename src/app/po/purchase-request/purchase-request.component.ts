import { RefTableDTO } from 'src/app/models/refTable.model';
import { ItemService } from './../../myShared/services/item.service';
import { PurchaseRequestAttachmentsDTO, PurchaseRequestDetailDTO } from './../../models/purchaseRequestHeaderDTO.model';
import { SupplierDTO } from './../../models/refTable.model';
import { TypeHeadSearchDTO } from './../../grid/gridModels/typeheadSearch.model';
import {ChangeDetectorRef, AfterContentChecked, Component, OnInit } from '@angular/core';
import { OperatorFunction, Observable, of, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { GridOptions, GridType } from 'src/app/grid/gridModels/gridOption.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { TypeheadService } from 'src/app/myShared/services/typehead.service';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { purchaseRequestHeaderDTO } from 'src/app/models/purchaseRequestHeaderDTO.model';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/myShared/services/common.service';
import { SearchObject } from 'src/app/grid/gridModels/searchObject.model';
import { environment } from 'src/environments/environment';
import { FileuploadService } from 'src/app/myShared/services/fileupload.service';
import { PoitemComponent } from '../poitem/poitem.component';


@Component({
  selector: 'app-purchase-request',
  templateUrl: './purchase-request.component.html',
  styleUrls: ['./purchase-request.component.css']
})
export class PurchaseRequestComponent implements OnInit {

  private subs = new SubSink();
  edited: boolean = false;
  modelPR: purchaseRequestHeaderDTO = {};
  modelSupplier: SupplierDTO = {};
  modelShiptTo: RefTableDTO[] = [];
  loggedUserDepartments: any[] = [];

  mode:string="";

  model: any;
  searching = false;
  searchFailed = false;
  formatter = (x: TypeHeadSearchDTO) => x.Name
  formatterx = (x: TypeHeadSearchDTO) => x.Name;

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.PR
      , SavedDBColumn: "SupplierID"
      , defaultSortColumnName: "PONo",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "PONo", colText: 'PONo' },
      { colName: "DepartmentName", colText: 'Department' }
      ,{ colName: "SupplierName", colText: 'Supplier' }
      ,{ colName: "ShipTo", colText: 'ShipTo' }
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
    public fileuploadService:FileuploadService
    ) { this.edited = false; }

  ngOnInit(): void {
    this.subs.sink = this.itemService.itemAdded().subscribe(r => {
      if(this.modelPR.PurchaseRequestDetail == undefined){
        this.modelPR.PurchaseRequestDetail=[];
      }
      if (this.modelPR.PurchaseRequestDetail.filter(x=> x.guid == r.guid).length >0){
        this.modelPR.PurchaseRequestDetail= this.modelPR.PurchaseRequestDetail.filter(x=> x.guid != r.guid);
        this.modelPR.PurchaseRequestDetail.push(r);
      }else{
        this.modelPR.PurchaseRequestDetail.push(r);
      }
    });

    this.setPage(this.gridOption.searchObject);

    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {

      if (params.id == 0) {
        this.NewPR();
      } else if (params.id > 0) {
        this.EditPR(params.id);
      } else {
        this.edited = false;
      }
    });
  }

  EditPR(id:number,isCopy:Boolean=false){
    this.edited = true;
    this.mode="Edit";

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

      if(isCopy){
        this.mode="Copy PR";
        this.modelPR.PoheaderId=0;
        this.modelPR.Pono="";
        this.modelPR.PoStatusRefId=0;
        this.modelPR.PoStatusRef=null;
        this.modelPR.PurchaseOrderApproval=[];
        this.modelPR.PurchaseRequestDetail.forEach(r => {
          r.PoheaderId=0;
          r.PodetId=0;
          r.guid=this.commonService.newGuid();
        });

        this.modelPR.PurchaseRequestAttachments .forEach(r => {
          r.PoheaderId=0;
          r.Id=0;
        });
      }

     }, (error) => {this.confirmDialogService.messageBox(environment.APIerror)});
  }

  NewPR(){
    this.mode="New";
    this.edited = true;
    this.modelPR = new purchaseRequestHeaderDTO();
    this.model=new TypeHeadSearchDTO();

    this.subs.sink = this.http.get<any>(`${environment.APIEndpoint}/Admin/LoggedUsersDeparmnts`)
      .subscribe((data) => { this.loggedUserDepartments = data; }, (error) => { this.confirmDialogService.messageBox(environment.APIerror)});

    this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'Ship To').subscribe(
      r => { this.modelShiptTo = r; }, (error) => {this.confirmDialogService.messageBox(environment.APIerror) });
  }

  ViewOnly(Id:number){
    this.router.navigate(["/request/edit"], { queryParams: { id: Id } });
    this.EditPR(Id,false);
  }

  setPage(obj: SearchObject) {
    this.subs.sink = this.http.post<any>(`${environment.APIEndpoint}/grid`, obj, {})
      .subscribe((data) => {   this.gridOption.datas = data; }, (error) => { this.confirmDialogService.messageBox(environment.APIerror);  });
  }

  Action(item: any) {
    if (item == undefined) {
      this.router.navigate(["/request/edit"], { queryParams: { id: 0 } });
    } else {
      this.router.navigate(["/request/edit"], {    queryParams: { id: item.Id } });
    }
    this.edited = true;
  }

  openXl(content,event) {
    event.srcElement.blur();
    event.preventDefault();
    const modalRef= this.modalService.open(PoitemComponent ,{ size: 'xl' });
  }

  editPoDetaisls(obj:PurchaseRequestDetailDTO) {
    const modalRef= this.modalService.open(PoitemComponent ,{ size: 'xl' });
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
      .subscribe((data) => { this.modelSupplier = data; this.modelPR.SupplierId = item.item.ID; }, (error) => { this.confirmDialogService.messageBox(environment.APIerror)  });
  }

  deleteItem(index:PurchaseRequestDetailDTO){
    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {
      if(index.PodetId > 0){
        this.modelPR.PurchaseRequestDetail=this.modelPR.PurchaseRequestDetail.filter(r=> r.ItemId != index.ItemId);
      }else
      {
        this.modelPR.PurchaseRequestDetail=this.modelPR.PurchaseRequestDetail.filter(r=> r.guid != index.guid);
      }

    }, function () { });
  }

  Save() {
    this.modelPR.PoStatusRefId = 27; //raised po
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/PurchaseRequest/SavePurchaseRequest`, this.modelPR, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['request']);
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => {this.confirmDialogService.messageBox(environment.APIerror)});
  }

  AddRowAttachemtns(){
    let obj=new PurchaseRequestAttachmentsDTO();
    this.modelPR.PurchaseRequestAttachments.push(obj);
  }

  addFile(event,i: PurchaseRequestAttachmentsDTO): void {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      this.fileuploadService
        .upload(file).subscribe(res => { i.UniqueFileName = String(res); });
    }
  }

  deleteFile(id:number){
    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {
        this.modelPR.PurchaseRequestAttachments = this.modelPR.PurchaseRequestAttachments.filter(item => item.Id != id);
    }, function () { });
  }

  copyPR(id:number){

    this.router.navigate(["/request/edit"], { queryParams: { id: 0 } });
    this.EditPR(id,true);
  }

  GetTotal(){
    let sum= 0;

this.modelPR?.PurchaseRequestDetail?.forEach(r=> sum += r.UnitPrice* r.Qty);

      return sum;

  }
}
