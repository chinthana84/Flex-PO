export class RefTable {
  public   RefId ?:number=0;
  public   RefTableName ?: string = "";
  public   RefDescription ?: string = "";
  public   DisplayName?: string = "";
}


export class ApprovalGroups
{
    public   ApprovalGroupId ?:number=0;
    public   Name  ?: string = "";
    public   Caps  ?: string = "";
    public   Remarks ?: string = "";
    public   StatusRefId ?:number=0;
    public   StatusRef?: RefTable ={}
}
