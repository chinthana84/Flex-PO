import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GridOptions } from '../gridModels/gridOption.model';

@Injectable({
  providedIn: 'root'
})
export class Grid3Service {

  constructor(private http: HttpClient, private router: Router) { }

  private myGridOption = new Subject<GridOptions>();

  initGrid(gridoption: GridOptions) {
    this.http.post<any>(`${environment.APIEndpoint}/grid`, gridoption.searchObject, {}).subscribe(r => {
      gridoption.datas = r;
      this.myGridOption.next(gridoption);
    });
  }

  getGridOption(): Observable<GridOptions> {
    return this.myGridOption.asObservable();
  }

}
