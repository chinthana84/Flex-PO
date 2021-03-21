import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchObject } from 'src/app/grid/gridModels/searchObject.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor(private http: HttpClient) { }

  public getGridData(obj: SearchObject) {
    return this.http.post<any>(`${environment.APIEndpoint}/grid`, obj, {})
 }
}
