import { FileuploadService } from 'src/app/myShared/services/fileupload.service';
import { LoaderService } from './../../myShared/services/loader.service';
import { TypeHeadSearchDTO } from 'src/app/grid/gridModels/typeheadSearch.model';
import { PurchaseRequestDetailDTO, PrdetailsAttachmentsDTO } from './../../models/purchaseRequestHeaderDTO.model';
import { ItemsDTO, RefTableDTO } from 'src/app/models/refTable.model';
import { AccountListDTO } from './../../models/refTable.model';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/myShared/services/common.service';
import { TypeheadService } from 'src/app/myShared/services/typehead.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { ItemService } from 'src/app/myShared/services/item.service';

@Component({
  selector: 'app-poitem',
  templateUrl: './poitem.component.html',
  styleUrls: ['./poitem.component.css']
})
export class PoitemComponent implements OnInit   {
  private subs = new SubSink();
  AccountCodes: AccountListDTO[] = [];
  JobCOdes: RefTableDTO[] = [];
  PaymentTypes: RefTableDTO[] = [];
  modelItem: ItemsDTO;
  details: PurchaseRequestDetailDTO;

  @Input() fromParent;

  model: any;
  searching = false;
  searchFailed = false;
  formatter = (x: TypeHeadSearchDTO) => x.Name
  formatterx = (x: TypeHeadSearchDTO) => x.Name;

  constructor(
    private loaderService: LoaderService,
    private modalService: NgbModal
    , private confirmDialogService: ConfirmDialogService
    , private typeheadService: TypeheadService
    , private http: HttpClient,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private itemService: ItemService,
    public commonService: CommonService
    , public activeModal: NgbActiveModal
    , public fileuploadService: FileuploadService
    ,private cdRef: ChangeDetectorRef) {
    this.modelItem = new ItemsDTO();
    this.details = new PurchaseRequestDetailDTO();



    this.subs.sink =this.http
    .get<any>(`${environment.APIEndpoint}/Admin/GetAllAccountList/`)
    .subscribe((data) => { this.AccountCodes = data; }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror);
    });

    this.subs.sink =this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'Job Codes').subscribe(
    r => { this.JobCOdes = r; }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror);
    });

    this.subs.sink = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'Payment Types').subscribe(
    r => { this.PaymentTypes = r; }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror);
    });


  }

  ngOnInit(): void {

    if (this.fromParent != undefined) {
      this.details = this.fromParent;
      this.details.ItemId = this.fromParent.Item.ItemId;
      this.modelItem = this.fromParent.Item;
      var x = new TypeHeadSearchDTO();
      x.ID = this.modelItem.ItemId;
      x.Name = this.modelItem.ItemDescription;
      this.model = x;
    }
  }


  AddITems() {
    this.details.AccountList = this.AccountCodes.filter(r => r.AccountListId == this.details.AccountListId)[0];
    this.details.JobRef = this.JobCOdes.filter(r => r.RefId === this.details.JobRefId)[0];

    this.details.PaymentTypeRef = this.PaymentTypes.filter(r => r.RefId === this.details.PaymentTypeRefId)[0];

    this.details.guid = this.commonService.newGuid();
    this.itemService.addItem(this.details);
    this.details = new PurchaseRequestDetailDTO();
    this.model = new TypeHeadSearchDTO();
  }

  selectedItem(ID: any) {
    this.subs.sink = this.http
      .get<any>(`${environment.APIEndpoint}/Admin/GetItemByID/` + ID.item.ID)
      .subscribe((data) => {
        this.modelItem = data;
        this.details.ItemId = data.ItemId;
        this.details.Item = data;
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });
  }


  searchItems = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.typeheadService.TypeHeadSearch(term, 2).pipe(
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


  AddRowAttachemtns() {
    let obj = new PrdetailsAttachmentsDTO();
    this.details.PrdetailsAttachments.push(obj);
  }

  deleteFile(id: number) {
    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {
      debugger
      this.details.PrdetailsAttachments = this.details.PrdetailsAttachments.filter(item => item.PrdetAttachmentId != id);
    }, function () { });
  }

  addFile(event, i: PrdetailsAttachmentsDTO): void {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      this.fileuploadService
        .upload(file).subscribe(res => { i.UniqueFileName = String(res); });
    }
  }


}
