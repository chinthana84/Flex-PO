import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { SearchObject } from '../gridModels/searchObject.model';

@Injectable()
export class GridService {
  x: SearchObject = {};
  private data = new BehaviorSubject<SearchObject>(this.x);
  currentData = this.data.asObservable()

  constructor(  private http: HttpClient) { }

  updateMessage(item: any) {
    this.data.next(item);
  }

  public getGridData(obj: SearchObject) {
    return this.http.post<any>(`${environment.APIEndpoint}/grid`, obj, {})
 }
}
