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

  export class MyNavigations {
    public login: string="login";
    public approvalGroups: string="approvalGroups";
    public approvalGroupsUsers: string="approvalGroupsUsers";
    public departments: string="departments";
    public masterData: string="masterData";
   }



