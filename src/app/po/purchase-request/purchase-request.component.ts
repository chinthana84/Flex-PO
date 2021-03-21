import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'src/app/grid/gridModels/gridOption.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-purchase-request',
  templateUrl: './purchase-request.component.html'
})
export class PurchaseRequestComponent implements OnInit {


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

  constructor( private confirmDialogService: ConfirmDialogService) { }

  ngOnInit(): void {
  }

  clickme(){
    debugger;
    this.confirmDialogService.messageBox("EROR")
  }

}
