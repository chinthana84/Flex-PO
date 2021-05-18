import { GridOptions } from 'src/app/grid/gridModels/gridOption.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { SearchObject } from '../gridModels/searchObject.model';

@Injectable()
export class GridService{

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

    });
     return this.myGridOption.asObservable();
  }

  reloadGrid(gridoption:GridOptions){
    this.myGridOption=new Subject<GridOptions>();
    this.http.post<any>(`${environment.APIEndpoint}/grid`, gridoption.searchObject, {}).subscribe(r=>{
      gridoption.datas=r;
      this.setGridOptions(gridoption);

    });
    return this.myGridOption.asObservable();
  }

  // constructor() { }

  // private detail=new Subject<PurchaseRequestDetailDTO>();

  // addItem(obj:PurchaseRequestDetailDTO){
  //   this.detail.next(obj);
  // }

  // itemAdded(){
  //   return this.detail.asObservable();
  // }


  setGridOptions(gridoption:GridOptions){

    this.myGridOption.next(gridoption);
  }

  getGridOptions(){
    return this.myGridOption.asObservable();
  }

  OrderByList(grid:GridOptions, colname: string) {
    debugger


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

  // public resetGrid(grid, path) {
  //   sessionStorage.setItem("filterid", "0")
  //   let d: any = {};
  //   this.router.navigate([path]);

  //   this.updateMessage(grid);
  //   return this.http.post<any>(`${environment.APIEndpoint}/grid`, grid.searchObject, {})
  // }

  // public gotoback(path) {
  //   sessionStorage.setItem("filterid", "0");
  //   this.router.navigate([path]).then(r => {
  //     window.location.reload();
  //   });
  // }

  // OrderByList(colname: string) {
  //   debugger
  //   this.gridOption.searchObject.defaultSortColumnName = colname;
  //   if (this.gridOption.searchObject.aseOrDesc == undefined) {
  //     this.gridOption.searchObject.aseOrDesc = "ASC"
  //   }

  //   if (this.gridOption.searchObject.aseOrDesc == "ASC") {
  //     this.gridOption.searchObject.aseOrDesc = "DESC"
  //   }
  //   else if (this.gridOption.searchObject.aseOrDesc == "DESC") {
  //     this.gridOption.searchObject.aseOrDesc = "ASC"
  //   }


  //   this.gridOption.searchObject.searchColName = this.searchComponent.searchColumn;
  //   this.gridOption.searchObject.searchText = this.searchComponent.searchText;

  //   this.setPage(this.gridOption.searchObject);
  // }




}
