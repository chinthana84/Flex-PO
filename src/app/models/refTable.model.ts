import { UserDetails } from "./secutiry.model";

export class RefTableDTO {
  public   RefId ?:number=0;
  public   RefTableName ?: string = "";
  public   RefDescription ?: string = "";
  public   DisplayName?: string = "";
}


export class ApprovalGroupsDTO
{
    public   ApprovalGroupId ?:number=0;
    public   Name  ?: string = "";
    public   Caps  ?: string = "";
    public   Remarks ?: string = "";
    public   StatusRefId ?:number=0;
    public   StatusRef?: RefTableDTO ={}

    public   ApprovalGroupUsers?: ApprovalGroupUsersDTO[]=[];
}

export   class ApprovalGroupUsersDTO
{
    public   ApprovalGroupUserId ?:number=0;
    public   ApprovalGroupId ?:number=0;
    public   UserId ?:number=0;

    public    ApprovalGroup?:ApprovalGroupsDTO;
    public   User ?: UserDetails;
    public guid?:string="";
}


export   class VwGetRefDistinctDTO
{
    public   RefTableName ?:string="";
}


export class DepWrapper
{
    public dep?:DepartmentsDTO    ;
    public   lstSecutiryGropp ?:SecurityGroupsDTO[];
}

export   class SecurityGroupsDTO
{
    public   SecurityGroupId ?:number=0;
    public   SecurityGroupName?:string=""
    public   StatusRefId ?:number=0;

    public   StatusRef?:RefTableDTO;

     public  DepartmentsSecurityGroups ?:DepartmentsSecurityGroupsDTO[]=[];

     public Checked?:boolean=true;
}


export   class DepartmentsSecurityGroupsDTO
{
    public   DepartmentsSecurityGroupsId ?:number=0;
    public   DepartmentId ?:number=0;
    public   SecurityGroupId ?:number=0;

    public   Department?:DepartmentsDTO ={}
    public   SecurityGroup?: SecurityGroupsDTO={}

    public checked?:boolean=true;
}


export   class DepartmentsDTO
{

    public   DepartmentId?:number=0;
    public   DepartmentName ?:string="";
    public   StatusRefId ?:number=0;

    public    StatusRef?:RefTableDTO={};
    public   DepartmentsSecurityGroups?: DepartmentsSecurityGroupsDTO[]=[];
}