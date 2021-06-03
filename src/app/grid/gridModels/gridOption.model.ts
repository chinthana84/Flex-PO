import { Grid } from "./grid.model";
import { SearchObject } from './searchObject.model';



export class GridOptions{
    gridID?:string="";
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
  PR = 6,
  PRApprove=7,
  AssignedToME=8,
  MyTasks=9,
  GRN=10
}

export enum PO_Status
{
    PR_Raised = 27,
    Rejected = 46,
    AssigedToMe = 51,
    CreatePO = 52,
    PO_Raised_Via_emial=72,
    Cancelled = 62,
    Order_Partially_Received = 63,
    Order_Receievd_in_Full = 64,
    Pending_Payment = 67,
    Drafts=66,
    Paid_Fully = 68,
    Paid_Partilly = 69,
    Completed = 70,
    Finance_Approved=43
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
   public departmentUsers="DepUsers";
   public myDepartments="MyDeps";
   public myTasks="MyTasks";
   }



