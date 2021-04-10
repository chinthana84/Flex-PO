import { PurchaseRequestDetailDTO } from './../../models/purchaseRequestHeaderDTO.model';
import { ItemsDTO } from 'src/app/models/refTable.model';
import { TypeHeadSearchDTO } from './../../grid/gridModels/typeheadSearch.model';
import { AccountListDTO, RefTableDTO } from './../../models/refTable.model';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
export class PoitemComponent implements OnInit {
  private subs = new SubSink();
  AccountCodes: AccountListDTO[] = [];
  JobCOdes: RefTableDTO[] = [];
  modelItem :ItemsDTO;
  details: PurchaseRequestDetailDTO;

  model: any;
  searching = false;
  searchFailed = false;
  formatter = (x: TypeHeadSearchDTO) => x.Name
  formatterx = (x: TypeHeadSearchDTO) => x.Name;

  constructor(private modalService: NgbModal, private confirmDialogService: ConfirmDialogService, private typeheadService: TypeheadService
    , private http: HttpClient,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
private itemService:ItemService,
    public commonService: CommonService) { this.modelItem=new ItemsDTO();this.details=new PurchaseRequestDetailDTO(); }

  ngOnInit(): void {
    this.subs.sink = this.http
      .get<any>(`${environment.APIEndpoint}/Admin/GetAllAccountList/`)
      .subscribe((data) => { this.AccountCodes = data; }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror);
      });

    this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'Job Codes').subscribe(
      r => { this.JobCOdes = r; }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror);
      });
  }

  AddITems() {
    //this.confirmDialogService.messageBox("CHECKx")

    this.details.AccountList=this.AccountCodes.filter(r=> r.AccountListId == this.details.AccountListId)[0];
    this.details.JobRef=this.JobCOdes.filter(r=> r.RefId === this.details.JobRefId)[0];
this.itemService.addItem(this.details);
  }

  selectedItem(item :any){
    debugger
    this.subs.sink = this.http
    .get<any>(`${environment.APIEndpoint}/Admin/GetItemByID/` + item.item.ID)
    .subscribe((data) => {
      this.modelItem = data;
      this.details.ItemId=data.ItemId;
      this.details.Item=data;
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
      this.typeheadService.TypeHeadSearch(term,2).pipe(
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

}


//GetItemByName
