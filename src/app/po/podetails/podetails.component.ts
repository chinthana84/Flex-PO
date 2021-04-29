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
}
