import { UserDetails } from "./secutiry.model";

export class SecurityGroupsUserDetailsDTO {
  public SecGroupUserDetailsId?: number = 0;
  public UserId?: number = 0;
  public SecurityGroupId?: number = 0;
  public guid?: string = "";

  public SecurityGroup?: SecurityGroupsDTO = {};
  public User?: UserDetails = {};

}

export class RefTableDTO {
  public RefId?: number = 0;
  public RefTableName?: string = "";
  public RefDescription?: string = "";
  public DisplayName?: string = "";
  public   RefDescription2 ?: string = "";
}


export class ApprovalGroupsDTO {
  public ApprovalGroupId?: number = 0;
  public Name?: string = "";
  public Caps?: string = "";
  public Remarks?: string = "";
  public StatusRefId?: number = 0;
  public StatusRef?: RefTableDTO = {}

  public ApprovalGroupUsers?: ApprovalGroupUsersDTO[] = [];
}

export class ApprovalGroupUsersDTO {
  public ApprovalGroupUserId?: number = 0;
  public ApprovalGroupId?: number = 0;
  public UserId?: number = 0;

  public ApprovalGroup?: ApprovalGroupsDTO;
  public User?: UserDetails;
  public guid?: string = "";
}


export class VwGetRefDistinctDTO {
  public RefTableName?: string = "";
}


export class DepWrapper {
  public dep?: DepartmentsDTO;
  public lstSecutiryGropp?: SecurityGroupsDTO[];
}

export class SecurityGroupsDTO {
  public SecurityGroupId?: number = 0;
  public SecurityGroupName?: string = ""
  public StatusRefId?: number = 0;

  public StatusRef?: RefTableDTO;

  public DepartmentsSecurityGroups?: DepartmentsSecurityGroupsDTO[] = [];

  public Checked?: boolean = true;
}


export class DepartmentsSecurityGroupsDTO {
  public DepartmentsSecurityGroupsId?: number = 0;
  public DepartmentId?: number = 0;
  public SecurityGroupId?: number = 0;

  public Department?: DepartmentsDTO = {}
  public SecurityGroup?: SecurityGroupsDTO = {}

  public checked?: boolean = true;
}


export class DepartmentsDTO {

  public DepartmentId?: number = 0;
  public DepartmentName?: string = "";
  public StatusRefId?: number = 0;

  public StatusRef?: RefTableDTO = {};
  public DepartmentsSecurityGroups?: DepartmentsSecurityGroupsDTO[] = [];
}

export class SupplierDTO
{
    public   SupplierId ?:number;
    public   SupplierName ?: string = "";
    public   SupplierAddress ?: string = "";
    public   Email ?: string = "";
    public   Contact ?: string = "";
    public   City ?: string = "";
    public   Phone ?: string = "";
    public   Fax ?: string = "";
    public   State ?: string = "";
    public   Postcode?: string = "";
    public   SupplierStatusId  ?:number=0;
    public   MyobLink ?: string = "";

}

export   class ItemsDTO
{


    public   ItemId ?:number=0;
    public   ItemDescription ?: string = "";
    public    Sih?:number=0;
    public    UnitId? :number = 0;
    public    UnitPrice:number=0;
    public    StatusId?:number=0;
}

export class AccountListDTO
{
    public   AccountListId ?:number=0;
    public   AccountCode ?: string = "";
    public   AccountName ?: string = "";
    public   AccountDescription?: string = "";
    public   AccountTypeId ?:number=0;
    public   AccountStatusId ?:number=0;


    public    AccountStatus ?:RefTableDTO;
    public   RefTablesDTO ?:RefTableDTO;
}
