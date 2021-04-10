import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TypeHeadSearchDTO } from 'src/app/grid/gridModels/typeheadSearch.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeheadService {
  constructor(private http: HttpClient) {}

  search(term: string) {
    if (term === '') {
      return of([]);
    }
    return this.http
      .get<TypeHeadSearchDTO[]>(`${environment.APIEndpoint}/TypeHead/GetSupplierByName/`+ term);
  }

  TypeHeadSearch(term: string,id:number) {
    return this.http
      .get<TypeHeadSearchDTO[]>(`${environment.APIEndpoint}/TypeHead/TypeHeadSearch/${term}/${id}` );
  }
}
