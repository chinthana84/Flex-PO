export class Login {
  public UserName?: string="";
  public  Password?: string="";
  public NewPassword?: string;
}

export class SecurityModel {
  public UserName?: string = "";
  public IsAuthenticated?: Boolean = false;

  public BearerToken?: string = "";

  public Supplier?: Boolean = false;

}
