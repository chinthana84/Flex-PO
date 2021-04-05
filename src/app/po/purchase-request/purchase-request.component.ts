import { TypeHeadSearchDTO } from './../../grid/gridModels/typeheadSearch.model';
import { Component, OnInit } from '@angular/core';
import { OperatorFunction, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { GridOptions } from 'src/app/grid/gridModels/gridOption.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { TypeheadService } from 'src/app/myShared/services/typehead.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-purchase-request',
  templateUrl: './purchase-request.component.html'
})
export class PurchaseRequestComponent implements OnInit {
  model: any;
  searching = false;
  searchFailed = false;

  gridOption: GridOptions = {
    datas: {},
    searchObject: {
      girdId: 1
      ,SavedDBColumn:"SupplierID"
      , defaultSortColumnName: "CompanyName",
      pageNo: 1,
      searchColName: '',
      colNames: [{ colName: "CompanyName", colText: 'Company Name' },
      { colName: "ContactName", colText: 'Contact Name' }
      ]
    }
  };
  closeResult: string;

  constructor(private modalService: NgbModal, private confirmDialogService: ConfirmDialogService,private typeheadService:TypeheadService) { }

  ngOnInit(): void {
  }

  clickme(){
    debugger;
    this.confirmDialogService.messageBox("EROR")
  }


  // search = (text$: Observable<string>) =>
  //   text$.pipe(
  //     debounceTime(300),
  //     distinctUntilChanged(),
  //     tap(() => this.searching = true),
  //     switchMap(term =>
  //       this.typeheadService.search(term).pipe(
  //         tap(() => this.searchFailed = false),
  //         catchError(() => {
  //           this.searchFailed = true;
  //           return of([]);
  //         }))
  //     ),
  //     tap(() => this.searching = false)
  //   )

    search  = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.typeheadService.search(term).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )

    open(content) {
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size: 'lg', backdrop: 'static'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  getDismissReason(reason: any) {
    throw new Error('Method not implemented.');
  }
  
    formatter = (x:  TypeHeadSearchDTO) => x.Name
    formatterx = (x: TypeHeadSearchDTO) => x.Name;
}
