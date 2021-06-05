import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrService {

  constructor() { }


  IsPRCanCancel(statusID:number){
    let status=  [27,39,41,42,43,44,45];

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

  IsCanViewPO(statusID:number){
    debugger
    let status=  [52,63,64,67,68,69,70,72];
    if ( status.filter(r=> r == statusID).length >0){
      return true;
    }
    return false;
  }


}
