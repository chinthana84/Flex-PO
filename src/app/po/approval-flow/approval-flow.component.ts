import { Component, Input, OnInit } from '@angular/core';
import { PurchaseOrderApprovalDTO } from 'src/app/models/purchaseRequestHeaderDTO.model';

@Component({
  selector: 'app-approval-flow',
  templateUrl: './approval-flow.component.html',
  styleUrls: ['./approval-flow.component.css']
})
export class ApprovalFlowComponent implements OnInit {

  @Input()
  approval_flow_data :PurchaseOrderApprovalDTO[]=[]

  constructor() { }

  ngOnInit(): void {
  }

}
