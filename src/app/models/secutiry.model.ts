export class Login {
  public UserName?: string = "";
  public Password?: string = "";
  public NewPassword?: string;
}

export class SecurityModel {
  public UserName?: string = "";
  public IsAuthenticated?: Boolean = false;

  public BearerToken?: string = "";
  public RefreshToken?:string="";

  public Supplier?: Boolean = false;

}

export class UserDetails {
  public UserId?: number = 0;
  public UserName?: string = "";
}


export class TokenApiModel
{
    public   AccessToken ?:string="";

    public   RefreshToken ?:string="";
}


export class ApprovalOfficersWrapperDTO
{
    public  Officers?:[ApprovalOfficersDTO[]]
}

export class ApprovalOfficersDTO
{
    public   UserID ?: number = 0;
    public   UserName ?: number = 0;
    public   ApprovalGroupID ?: number = 0;
    public   ApprovalGroupName?: number = 0;
}
