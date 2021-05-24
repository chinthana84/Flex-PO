import { GridOptions } from 'src/app/grid/gridModels/gridOption.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { SearchObject } from '../gridModels/searchObject.model';

@Injectable()
export class Grid2Service{

  private _bar:GridOptions = {};

  get bar():GridOptions {
    return this._bar;
  }

  set bar(theBar:GridOptions) {
    this._bar = theBar;
  }

  ngOnDestroy() {
    alert('Service destroy')
  }
  private myGridOption =new Subject<GridOptions>();

  initGrid(gridoption:GridOptions){
    sessionStorage.setItem("filterid", "0");
    this.myGridOption=new Subject<GridOptions>();
    gridoption.searchObject.searchText="";
    gridoption.searchObject.postatusid="0";
debugger
    this.http.post<any>(`${environment.APIEndpoint}/grid`, gridoption.searchObject, {}).subscribe(r=>{
      gridoption.datas=r;
      this.setGridOptions(gridoption);
      this.bar=gridoption;

    });
     return this.myGridOption.asObservable();
  }

  reloadGrid(gridoption:GridOptions){
    this.myGridOption=new Subject<GridOptions>();
    this.http.post<any>(`${environment.APIEndpoint}/grid`, gridoption.searchObject, {}).subscribe(r=>{
      gridoption.datas=r;
      this.setGridOptions(gridoption);
      this.bar=gridoption;
    });
    return this.myGridOption.asObservable();
  }

  setGridOptions(gridoption:GridOptions){

    this.myGridOption.next(gridoption);
  }

  getGridOptions(){
    return this.myGridOption.asObservable();
  }

  OrderByList(  colname: string) {
    debugger

    let grid=this.bar;
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


    this.reloadGrid(grid);



    // this.myGridOption.searchObject.searchColName = this.searchComponent.searchColumn;
    // this.myGridOption.searchObject.searchText = this.searchComponent.searchText;

   // this.setPage(this.gridOption.searchObject);
  }


/////////////////////////////////////////////////////
  x: SearchObject = {};
  private data = new BehaviorSubject<SearchObject>(this.x);
  currentData = this.data.asObservable()

  constructor(private http: HttpClient, private router: Router) { }

  updateMessage(item: any) {
    this.data.next(item);
  }

  public getGridData(obj: SearchObject) {
    return this.http.post<any>(`${environment.APIEndpoint}/grid`, obj, {})
  }

    public gotoback(path) {
    sessionStorage.setItem("filterid", "0");
    this.router.navigate([path]).then(r => {
      window.location.reload();
    });
  }




}
