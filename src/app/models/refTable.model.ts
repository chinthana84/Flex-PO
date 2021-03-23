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
    public   UserDetailsDTO ?: UserDetails;
    public guid?:string="";
}
