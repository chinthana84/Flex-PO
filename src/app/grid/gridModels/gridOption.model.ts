import { Grid } from "./grid.model";
import { SearchObject } from './searchObject.model';



export class GridOptions{
    colNames?: Grid[];
    searchObject?: SearchObject={};
    datas?:any;
    GridClassInstance ?:any
    searchID?:number=1
  }

  export enum GridType {
    ApprovalGroups=1,
    Departments=2
  }
