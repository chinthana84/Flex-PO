import { GridOptions, GridType, PO_Status } from './../../../grid/gridModels/gridOption.model';
import { Component, OnInit } from '@angular/core';
import { Grid3Service } from 'src/app/grid/grid-service/grid3.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { purchaseRequestHeaderDTO } from 'src/app/models/purchaseRequestHeaderDTO.model';
import { SupplierDTO, RefTableDTO } from 'src/app/models/refTable.model';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GridService } from 'src/app/grid/grid-service/grid.service';
import { Grid2Service } from 'src/app/grid/grid-service/grid2.service';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/myShared/services/common.service';
import { FileuploadService } from 'src/app/myShared/services/fileupload.service';
import { ItemService } from 'src/app/myShared/services/item.service';
import { LoaderService } from 'src/app/myShared/services/loader.service';
import { PrService } from 'src/app/myShared/services/pr.service';
import { TypeheadService } from 'src/app/myShared/services/typehead.service';
import { POViewNewComponent } from '../../poview-new/poview-new.component';

@Component({
  selector: 'app-viewpr',
  templateUrl: './viewpr.component.html',
  styleUrls: ['./viewpr.component.css']
})
export class ViewprComponent implements OnInit {

  constructor(    private loaderService: LoaderService,
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
    public prService: PrService) {   this.edited = false;}

  public myEnum = PO_Status;

  private subs = new SubSink();
  edited: boolean = false;
  modelPR: purchaseRequestHeaderDTO = {};
  modelSupplier: SupplierDTO = {};
  modelShiptTo: RefTableDTO[] = [];
  loggedUserDepartments: any[] = [];
  Gst: RefTableDTO[] = [];



  gridOption2: GridOptions = {
    gridID: "bbbb",
    datas: {},
    searchObject: {
      girdId: GridType.PR_VIEW
      , SavedDBColumn: "SupplierID"
      , defaultSortColumnName: "PONo",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "PONo", colText: 'PONo' },
      { colName: "DepartmentName", colText: 'Department' },
      { colName: "POStatusID=27", colText: 'PR Raised' },
      { colName: "POStatusID=28", colText: 'ManagerApproved' }
      ]
    }
  };

  Action(item: any) {
    if (item == undefined) {
      this.router.navigate(["/request/edit"], { queryParams: { id: 0 } });
    } else {
      this.router.navigate(["/request/edit"], { queryParams: { id: item.Id } });
    }
    this.edited = true;
  }

  ViewOnly(Id: number) {
    this.router.navigate(["/request/edit"], { queryParams: { id: Id } });
    this.EditPR(Id, false);
  }

  EditPR(id: number, isCopy: Boolean = false) {
    this.edited = true;

    let x = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/LoggedUsersDeparmnts`);
    let y = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'Ship To');
    let z = this.http.get<any>(`${environment.APIEndpoint}/PurchaseRequest/GetPurchaseRequestByID/` + id);
    let a = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'GST');

    forkJoin([x, y, z,a]).subscribe((data) => {
      this.loggedUserDepartments = data[0];
      this.modelShiptTo = data[1];
      this.modelPR = data[2];
      this.modelSupplier = data[2].Supplier;
      this.modelPR.SupplierId = data[2].SupplierId;
      this.modelPR.Podate = new Date(this.modelPR.Podate);
      this.Gst= data[3];


    }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
  }

  POPreview(){
    this.http.get<any>(`${environment.APIEndpoint}/PurchaseRequest/ViewPOByPrID/${this.modelPR.PoheaderId}`).subscribe(r => {
      const modalRef = this.modalService.open(POViewNewComponent, { size: 'xl' });
      modalRef.componentInstance.poFROMPARANT = r; });
  }

  ngOnInit(): void {
    this.gridService3.initGridNew(this.gridOption2);
  }

}
