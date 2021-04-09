import { PurchaseRequestDetailDTO } from './../../models/purchaseRequestHeaderDTO.model';
import { SupplierDTO } from './../../models/refTable.model';
import { TypeHeadSearchDTO } from './../../grid/gridModels/typeheadSearch.model';
import { Component, OnInit } from '@angular/core';
import { OperatorFunction, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { GridOptions, GridType } from 'src/app/grid/gridModels/gridOption.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { TypeheadService } from 'src/app/myShared/services/typehead.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  modelPR: purchaseRequestHeaderDTO;
  modelSupplier:SupplierDTO={};
  loggedUserDepartments: any[]=[];


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

    public commonService: CommonService) { this.edited = false; }

  ngOnInit(): void {
    this.setPage(this.gridOption.searchObject);

    this.subs.sink = this.activatedRoute.queryParams.subscribe((params) => {

      if (params.id == 0) {
        this.edited = true;
        this.modelPR = new purchaseRequestHeaderDTO();

        this.subs.sink = this.http
        .get<any>(`${environment.APIEndpoint}/Admin/LoggedUsersDeparmnts` )
        .subscribe((data) => { this.loggedUserDepartments = data; }, (error) => {
          this.confirmDialogService.messageBox(environment.APIerror)
        });

      } else if (params.id > 0) {
        this.edited = true;


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

  AddRow(){
debugger
    let obj=new PurchaseRequestDetailDTO;

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


    searchItems = (text$: Observable<string>) =>
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

    selectedItem(item :any){
      debugger
      this.subs.sink = this.http
      .get<any>(`${environment.APIEndpoint}/Admin/GetSupplierByID/` + item.item.ID)
      .subscribe((data) => { this.modelSupplier = data; }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });
    }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: 'static' }).result.then((result) => {
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
}
