import { Component, Input, OnInit } from '@angular/core';
import { purchaseRequestHeaderDTO } from 'src/app/models/purchaseRequestHeaderDTO.model';

@Component({
  selector: 'app-podetails',
  templateUrl: './podetails.component.html',
  styleUrls: ['./podetails.component.css']
})
export class PodetailsComponent implements OnInit {


  @Input()  PassingmodelPR: purchaseRequestHeaderDTO ;
  constructor() { }

  ngOnInit(): void {

  }

  GetTotal(){
    let sum= 0;

this.PassingmodelPR?.PurchaseRequestDetail?.forEach(r=> sum += r.UnitPrice* r.Qty);

      return sum;

  }
}
