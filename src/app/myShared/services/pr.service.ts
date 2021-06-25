import { purchaseRequestHeaderDTO } from 'src/app/models/purchaseRequestHeaderDTO.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrService {

  constructor() { }


  IsPRCanCancel(statusID:number){
    let status=  [27,39,41,42,44,45];

    if ( status.filter(r=> r == statusID).length >0){
      return true;
    }
    return false;
  }

  IsCanOrderRecevie(statusID:number){
    let status=  [52,72];
    if ( status.filter(r=> r == statusID).length >0){
      return true;
    }
    return false;
  }

  IsPaidOption(statusID:number){
    let status=  [67,68,69];
    if ( status.filter(r=> r == statusID).length >0){
      return true;
    }
    return false;
  }

  IsCompletedVisible(statusID:number){
    let status=  [68,69];
    if ( status.filter(r=> r == statusID).length >0){
      return true;
    }
    return false;
  }

  IsViewPO(statusID:number){
    let status=  [52,63,64,67,68,69,70,72];
    if ( status.filter(r=> r == statusID).length >0){
      return true;
    }
    return false;
  }

  IsCanViewPO(statusID:number){

    let status=  [52,63,64,67,68,69,70,72];
    if ( status.filter(r=> r == statusID).length >0){
      return true;
    }
    return false;
  }


  GetTotalGst(modelPR: purchaseRequestHeaderDTO) {
    return  this.GetTotal(modelPR) *  (modelPR.Gst /100)

   }

   GetTotal(modelPR: purchaseRequestHeaderDTO) {
     let sum = 0;
     modelPR?.PurchaseRequestDetail?.forEach(r => sum += r.UnitPrice * r.Qty);
     return sum;
   }

   GetTotalWithGST(modelPR: purchaseRequestHeaderDTO){
     debugger
     if(modelPR.IsGst==true){
       return this.GetTotal(modelPR) + this.GetTotalGst(modelPR)
     }
     else{
       return this.GetTotal(modelPR);
     }
   }


}
