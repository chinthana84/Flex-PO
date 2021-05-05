import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  isLoadingRequest = new Subject<boolean>();

  main$ = this.isLoadingRequest.asObservable();
  show() {
      this.isLoadingRequest.next(true);
  }
  hide() {
      this.isLoadingRequest.next(false);
  }
}
