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
  ApprovalGroups = 1,
  Departments = 2,
  Supplier = 3,
  Item = 4,
  AccountList = 5,
  PR=6
}

  export class MyNavigations {
    public login: string="login";
    public approvalGroups: string="approvalGroups";
    public approvalGroupsUsers: string="approvalGroupsUsers";
    public departments: string="departments";
    public masterData: string="masterData";
    public supplier:string="supplier";
   public items:string="items";
   public accountList="AccountList";
   }



