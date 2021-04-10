import { PurchaseRequestDetailDTO } from './../../models/purchaseRequestHeaderDTO.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor() { }

  private detail=new Subject<PurchaseRequestDetailDTO>();

  addItem(obj:PurchaseRequestDetailDTO){
    this.detail.next(obj);
  }

  itemAdded(){
    return this.detail.asObservable();
  }

}
