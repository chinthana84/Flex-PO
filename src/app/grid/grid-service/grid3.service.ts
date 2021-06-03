import { GridOptions } from 'src/app/grid/gridModels/gridOption.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Grid3Service {
  constructor(private http: HttpClient, private router: Router) { }

  private myGridOptionList: GridOptions[];
  private myGridOptionArray = new Subject<GridOptions[]>();

  initGridNew(gridoption: GridOptions) {

    this.http.post<any>(`${environment.APIEndpoint}/grid`, gridoption.searchObject, {}).subscribe(r => {
      gridoption.datas = r;

      if (this.myGridOptionList == undefined) {
        this.myGridOptionList = [];
      } else {
        if (this.myGridOptionList.filter(r => r.gridID == gridoption.gridID).length > 0) {
          this.myGridOptionList = this.myGridOptionList.filter(r => r.gridID != gridoption.gridID);
        }
      }
      this.myGridOptionList.push(gridoption);
      this.myGridOptionArray.next(this.myGridOptionList)
      console.log(this.myGridOptionList)
    });
  }

  getGridOptionsXXX(): Observable<GridOptions[]> {
    return this.myGridOptionArray.asObservable();
  }

  OrderByList(gridid:string,  colname: string) {
debugger

   let grid= this.myGridOptionList.filter(r => r.gridID == gridid)[0];


    grid.datas={}
    grid.searchObject.pageNo=1;

      grid.searchObject.defaultSortColumnName = colname;
    if (grid.searchObject.aseOrDesc == undefined) {
      grid.searchObject.aseOrDesc = "ASC"
    }

    if (grid.searchObject.aseOrDesc == "ASC") {
      grid.searchObject.aseOrDesc = "DESC"
    }
    else if (grid.searchObject.aseOrDesc == "DESC") {
      grid.searchObject.aseOrDesc = "ASC"
    }


      this.initGridNew(grid);
  }

  public gotoback(path) { 
    this.router.navigate([path]).then(r => {
      window.location.reload();
    });
  }

}
