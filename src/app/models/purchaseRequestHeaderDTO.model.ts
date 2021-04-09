import { DepartmentsDTO, ItemsDTO, RefTableDTO, SupplierDTO } from 'src/app/models/refTable.model';
import { AccountListDTO } from "./refTable.model";

export   class purchaseRequestHeaderDTO
{
  public   PoheaderId?: number=0;
  public  Pono ?:string=""
  public  SupplierId ?: number=0;
  public  DepartmentId ?: number=0;
  public   Poremarks ?:string=""
  public  ShipToRefId ?: number=0;
  public   OtherShiptTo ?:string=""
  public  PoStatusRefId ?: number=0;


  public    Department?: DepartmentsDTO
  public    PoStatusRef ?: RefTableDTO
  public     ShipToRef ?: RefTableDTO;
  public   PurchaseRequestDetail?: PurchaseRequestDetailDTO[]=[];
}


export class PurchaseRequestDetailDTO
{
    public   PodetId ?: number=0;
    public   PoheaderId ?: number=0;
    public   ItemId ?: number=0;
    public   SupplierId ?: number=0;
    public   Qty ?: number=0;
    public   AccountListId ?: number=0;
    public   JobRefId ?: number=0;
    public  UnitPrice ?: number=0;
    public   Reference ?:string=""

    public    AccountList?: AccountListDTO;
    public    Item ?: ItemsDTO;
    public    JobRef ?: RefTableDTO;
    public    Poheader ?:purchaseRequestHeaderDTO;
    public    Supplier ?: SupplierDTO;
}
