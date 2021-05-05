import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { GridOptions, GridType, PO_Status } from 'src/app/grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/grid/gridModels/searchObject.model';
import { purchaseRequestHeaderDTO } from 'src/app/models/purchaseRequestHeaderDTO.model';
import { RefTableDTO } from 'src/app/models/refTable.model';
import { UserDetails } from 'src/app/models/secutiry.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/myShared/services/common.service';
import { FileuploadService } from 'src/app/myShared/services/fileupload.service';
import { ItemService } from 'src/app/myShared/services/item.service';
import { TypeheadService } from 'src/app/myShared/services/typehead.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.css']
})
export class GrnComponent implements OnInit {


  private subs = new SubSink();
  edited: boolean = false;
  modelPR: purchaseRequestHeaderDTO = {};
  actionID: number = 0;

  status: RefTableDTO[] = [];
  selectedStatusID: number = 0;

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.GRN
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


    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {

      if (params.id > 0) {
        // this.getStatus();
        this.EditPR(params.id);
      } else {
        this.edited = false;
      }
    });
  }

  EditPR(id: number) {
    this.edited = true;
    //  this.getStatusPO();

    let z = this.http.get<any>(`${environment.APIEndpoint}/PurchaseRequest/GetPurchaseRequestByID/` + id);
    let a = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'PO_STATUS');
    forkJoin([z, a]).subscribe((data) => {

      this.modelPR = data[0];
      this.modelPR.Podate = new Date(this.modelPR.Podate);
      //this.selectedStatusID = this.modelPR.PoStatusRefId;
debugger
      if (this.modelPR.PoStatusRefId == PO_Status.CreatePO) {

        this.status = data[1].filter(r => r.RefId === PO_Status.Order_Partially_Received || r.RefId == PO_Status.Order_Receievd_in_Full);
      }
      else if (this.modelPR.PoStatusRefId ==  PO_Status.Order_Partially_Received || this.modelPR.PoStatusRefId ==  PO_Status.Order_Receievd_in_Full) {
        this.status = data[1].filter(r =>   r.RefId == PO_Status.Pending_Payment  );
      }
      else if (this.modelPR.PoStatusRefId == PO_Status.Pending_Payment){
        this.status = data[1].filter(r => r.RefId == PO_Status.Paid_Fully || r.RefId== PO_Status.Paid_Partilly  );
      }

      console.log(this.modelPR )





    }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
  }



  ViewOnly(Id: number) {
    this.router.navigate(["/grn/edit"], { queryParams: { id: Id } });
    // this.EditPR(Id);
  }

  setPage(obj: SearchObject) {
    this.subs.sink = this.http.post<any>(`${environment.APIEndpoint}/grid`, obj, {})
      .subscribe((data) => {
        this.gridOption.datas = data;
      }, (error) => { this.confirmDialogService.messageBox(environment.APIerror); });
  }




  FinalSaveStepsOnPO() {
debugger
    // if (this.modelPR.PoStatusRefId === PO_Status.CreatePO)
    // {
    //   this.modelPR.PoStatusRefId = this.selectedStatusID;
    // }
    // else if (this.modelPR.PoStatusRefId === PO_Status.Order_Partially_Received || this.modelPR.PoStatusRefId === PO_Status.Order_Receievd_in_Full){
    //   this.modelPR.PoStatusRefId = this.selectedStatusID;
    // }
    this.modelPR.PoStatusRefId = this.selectedStatusID;
    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/PurchaseRequest/FinalSaveStepsOnPO`, this.modelPR, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['grn']);
          this.setPage(this.gridOption.searchObject);
        }
      }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
  }


  // getStatusPO(){
  //   this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'PO_STATUS')
  //   .subscribe((data) => {

  //      this.status=data.filter(r=> r.RefId === 63 || r.RefId == 64);


  //   }, (error) => { this.confirmDialogService.messageBox(environment.APIerror);  });
  // }

  save() {
    // if(this.actionID==1){
    //   this.confirmDialogService.confirmThis("Are you sure to Cancel this?", () => {
    //     this.Cancel();
    //       }, function () { });
    // }
    // else if(this.actionID==2){
    //   this.reassinged();
    // }
    // else{
    //   this.confirmDialogService.messageBox("Invalid")
    // }
  }

  isCanCancel() {

    const statusid = this.modelPR.PoStatusRefId;

    if (statusid == 27 || statusid == 51 || statusid == 52) {
      return true;
    }

    return false;
   
  }

  isCanReassinged() {

    const statusid = this.modelPR.PoStatusRefId;

    if (statusid == 51) {
      return true;
    }

    return false;
  }


  GetTotal() {
    let sum = 0;

    this.modelPR?.PurchaseRequestDetail?.forEach(r => sum += r.UnitPrice * r.Qty);

    return sum;

  }

}
