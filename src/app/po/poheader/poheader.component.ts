import { Component, Input, OnInit } from '@angular/core';
import { purchaseRequestHeaderDTO } from 'src/app/models/purchaseRequestHeaderDTO.model';

@Component({
  selector: 'app-poheader',
  templateUrl: './poheader.component.html',
  styleUrls: ['./poheader.component.css']
})
export class PoheaderComponent implements OnInit {


  @Input()  PassingmodelPR: purchaseRequestHeaderDTO ;
  constructor() { }

  ngOnInit(): void {
    
  }

}
