import { GridService } from 'src/app/grid/grid-service/grid.service';
import { FileuploadService } from 'src/app/myShared/services/fileupload.service';
import { PurchaseRequestDetailDTO, purchaseRequestHeaderDTO } from 'src/app/models/purchaseRequestHeaderDTO.model';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { GridOptions, GridType } from 'src/app/grid/gridModels/gridOption.model';
import { SearchObject } from 'src/app/grid/gridModels/searchObject.model';
import { ItemsDTO, RefTableDTO } from 'src/app/models/refTable.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/myShared/services/common.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { PoitemComponent } from '../poitem/poitem.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from 'src/app/myShared/services/item.service';



@Component({
  selector: 'app-purchase-request-approval',
  templateUrl: './purchase-request-approval.component.html',
  styleUrls: ['./purchase-request-approval.component.css']
})
export class PurchaseRequestApprovalComponent implements OnInit {
  private subs = new SubSink();
  modelPR: purchaseRequestHeaderDTO = {};

  edited: boolean = false;

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.PRApprove
      , SavedDBColumn: "Name"
      , defaultSortColumnName: "Pono",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "Pono", colText: 'Pono' }]
    }
  };


  constructor(
    private http: HttpClient,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService,
    public commonService: CommonService,
    public fileuploadService: FileuploadService,
    private modalService: NgbModal,
    private itemService: ItemService,
    private gridService :GridService
  ) {
    this.edited = false;
  }

  ngOnInit() {

    this.gridService.initGrid(this.gridOption) ;
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

      this.modelPR.IsApproval=true;
      this.subs.sink = this.http
        .post<any>(`${environment.APIEndpoint}/PurchaseRequest/SavePurchaseRequest`, this.modelPR, {}).subscribe((data) => {
          if (data.IsValid == false) {
            this.confirmDialogService.messageListBox(data.ValidationMessages);
          }
          else {

          }
        }, (error) => { this.modelPR.PoStatusRefId = 0; this.confirmDialogService.messageBox(environment.APIerror) });


    });


 //   this.setPage(this.gridOption.searchObject);
    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id > 0) {
        this.edited = true;
        this.http.get<any>(`${environment.APIEndpoint}/PurchaseRequest/GetPurchaseRequestByID/` + params.id).subscribe(r => {

          this.modelPR = r;

        }, (error) => {
          this.confirmDialogService.messageBox(environment.APIerror);

        });
      } else {
        this.edited = false;
        this.gridService.initGrid(this.gridOption) ;
      }
    });
  }

  // setPage(obj: SearchObject) {
  //   this.subs.sink = this.http.post<any>(`${environment.APIEndpoint}/grid`, obj, {})
  //     .subscribe((data) => {
  //       this.gridOption.datas = data;
  //       console.log(data)
  //       if (this.gridOption.datas.pagedItems == 0) {
  //         this.gridOption.datas.pagedItems = [];
  //       }
  //     }, (error) => {
  //       this.confirmDialogService.messageBox(environment.APIerror);
  //     });
  // }

  editPoDetaisls(obj: PurchaseRequestDetailDTO) {

    const modalRef = this.modalService.open(PoitemComponent, { size: 'xl' });
    modalRef.componentInstance.fromParent = obj;
  }

  Approve(isApproved: Boolean) {

    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/PurchaseRequest/ApprovRequest`, this.modelPR, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['requestapproval']);
         // this.setPage(this.gridOption.searchObject);
        }
      }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });

  }


  Reject(isApproved: Boolean) {

    this.subs.sink = this.http
      .post<any>(`${environment.APIEndpoint}/PurchaseRequest/RejectRequest`, this.modelPR, {}).subscribe((data) => {
        if (data.IsValid == false) {
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toastr.success(environment.dataSaved);
          this.router.navigate(['requestapproval']);
         // this.setPage(this.gridOption.searchObject);
        }
      }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });

  }

  Action(item: any) {
    this.router.navigate(["/requestapproval/edit"], { queryParams: { id: item.PoheaderId } });
    this.edited = true;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  GetTotal() {
    let sum = 0;

    this.modelPR?.PurchaseRequestDetail?.forEach(r => sum += r.UnitPrice * r.Qty);

    return sum;

  }
}
