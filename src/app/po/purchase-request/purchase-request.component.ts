import { RefTableDTO } from 'src/app/models/refTable.model';
import { ItemService } from './../../myShared/services/item.service';
import { PurchaseRequestDetailDTO } from './../../models/purchaseRequestHeaderDTO.model';
import { SupplierDTO } from './../../models/refTable.model';
import { TypeHeadSearchDTO } from './../../grid/gridModels/typeheadSearch.model';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-purchase-request',
  templateUrl: './purchase-request.component.html'
})
export class PurchaseRequestComponent implements OnInit {


  private subs = new SubSink();
  edited: boolean = false;
  modelPR: purchaseRequestHeaderDTO={};
  modelSupplier: SupplierDTO = {};
  modelShiptTo: RefTableDTO[]=[];
  loggedUserDepartments: any[] = [];


  model: any;
  searching = false;
  searchFailed = false;

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: GridType.PR
      , SavedDBColumn: "SupplierID"
      , defaultSortColumnName: "CompanyName",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "CompanyName", colText: 'Company Name' },
      { colName: "ContactName", colText: 'Contact Name' }
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
    public commonService: CommonService) { this.edited = false; }

  ngOnInit(): void {

    this.subs.sink = this.itemService.itemAdded().subscribe(r => {

      this.modelPR.PurchaseRequestDetail.push(r);
    });

    this.setPage(this.gridOption.searchObject);

    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {

      if (params.id == 0) {
        this.edited = true;
        this.modelPR = new purchaseRequestHeaderDTO();

        this.subs.sink = this.http
          .get<any>(`${environment.APIEndpoint}/Admin/LoggedUsersDeparmnts`)
          .subscribe((data) => { this.loggedUserDepartments = data; }, (error) => {
            this.confirmDialogService.messageBox(environment.APIerror)
          });

          this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'Ship To').subscribe(
            r=>{this.modelShiptTo=r;},  (error) => {
              this.confirmDialogService.messageBox(environment.APIerror)
            });

      } else if (params.id > 0) {
        this.edited = true;

        let x = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/LoggedUsersDeparmnts`);
        let y = this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'Ship To');
        let z = this.http.get<any>(`${environment.APIEndpoint}/PurchaseRequest/GetPurchaseRequestByID/` + params.id);
        forkJoin([x, y,z]).subscribe((data) => {
          this.loggedUserDepartments = data[0];
          this.modelShiptTo = data[1];


          this.modelPR=data[2];;

          this.modelSupplier = data[2].Supplier;
          this.modelPR.SupplierId=data[2].SupplierId;
         this.modelPR.Podate=new Date(this.modelPR.Podate);

        }, (error) => {
         this.confirmDialogService.messageBox(environment.APIerror)
        });


        // this.subs.sink = this.http
        //   .get<any>(`${environment.APIEndpoint}/Admin/LoggedUsersDeparmnts`)
        //   .subscribe((data) => { this.loggedUserDepartments = data; }, (error) => {
        //     this.confirmDialogService.messageBox(environment.APIerror)
        //   });

        //   this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'Ship To').subscribe(
        //     r=>{this.modelShiptTo=r;},  (error) => {
        //       this.confirmDialogService.messageBox(environment.APIerror)
        //     });

          // this.http.get<any>(`${environment.APIEndpoint}/PurchaseRequest/GetPurchaseRequestByID/` + params.id).subscribe(
          //   r=>{

          //     this.modelPR=r;

          //     this.modelSupplier = r.Supplier;
          //     this.modelPR.SupplierId=r.SupplierId;
          //    this.modelPR.Podate=new Date(this.modelPR.Podate);

          //         },  (error) => {
          //     this.confirmDialogService.messageBox(environment.APIerror)
          //   });
      } else {
        this.edited = false;
      }
    });
  }

  setPage(obj: SearchObject) {
    this.subs.sink = this.http.post<any>(`${environment.APIEndpoint}/grid`, obj, {})
      .subscribe((data) => {
        this.gridOption.datas = data;
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror);
      });
  }

  Action(item: any) {

    if (item == undefined) {
      this.router.navigate(["/request/edit"], { queryParams: { id: 0 } });
    } else {
      this.router.navigate(["/request/edit"], {
        queryParams: { id: item.Id },
      });
    }
    this.edited = true;
  }

  AddRow() {
    debugger
    let obj = new PurchaseRequestDetailDTO;

    this.modelPR.PurchaseRequestDetail.push(obj);
  }

  openXl(content) {
    this.modalService.open(content, { size: 'xl' });
  }

  clickme() {
    ;
    this.confirmDialogService.messageBox("EROR")
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


   public test(a:any){
      return '2021-01-15';
    }


  selectedItem(item: any) {
    debugger
    this.subs.sink = this.http
      .get<any>(`${environment.APIEndpoint}/Admin/GetSupplierByID/` + item.item.ID)
      .subscribe((data) => { this.modelSupplier = data; this.modelPR.SupplierId=item.item.ID;}, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  getDismissReason(reason: any) {
    throw new Error('Method not implemented.');
  }

  formatter = (x: TypeHeadSearchDTO) => x.Name
  formatterx = (x: TypeHeadSearchDTO) => x.Name;


  Save() {
    debugger
 this.modelPR.PoStatusRefId=27; //raised po
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
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)

        //this.errorHandler.handleError(error);

      });
  }

}
