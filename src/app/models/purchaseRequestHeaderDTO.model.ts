
import { ApprovalGroupsDTO, DepartmentsDTO, ItemsDTO, RefTableDTO, SupplierDTO } from 'src/app/models/refTable.model';
import { AccountListDTO } from "./refTable.model";
import { UserDetails } from './secutiry.model';

export class purchaseRequestHeaderDTO {
  public PoheaderId?: number = 0;
  public Pono?: string = ""
  public SupplierId?: number = 0;
  public DepartmentId?: number = 0;
  public Poremarks?: string = ""
  public ShipToRefId?: number = 0;
  public OtherShiptTo?: string = ""
  public PoStatusRefId?: number = 0;
  public Podate?: Date;

  public ApprovalRemarks?: string = "";

  public AssignedToMeUserId?: number = 0;
  public  AssignedUpdatedDate?:Date

  public PoOrderRefId?: number = 0;

  public CancellRemarks?: string = "";

  public Department?: DepartmentsDTO = {};
  public PoStatusRef?: RefTableDTO = {};
  public ShipToRef?: RefTableDTO = {};
  public Supplier?: SupplierDTO = {};
  public PurchaseRequestDetail?: PurchaseRequestDetailDTO[] = [];
  public PurchaseRequestAttachments?: PurchaseRequestAttachmentsDTO[] = [];
  public PurchaseOrderApproval?: PurchaseOrderApprovalDTO[] = [];
  public UpdatedUserNavigation?: UserDetails = {};
  public CreatedUserNavigation?: UserDetails = {};

  public TLApproval?: number = 0;
  public MApproval?: number = 0;
  public CSMApproval?: number = 0;
  public CEOApproval?: number = 0;
  public BoardApproval?: number = 0;

  public IsApproval?: boolean = false;

  public   Gst ?: number = 0;
  public  IsGst ?:Boolean=false;
}


export class PurchaseRequestDetailDTO {
  public PodetId?: number = 0;
  public PoheaderId?: number = 0;
  public ItemId?: number = 0;
  public Qty?: number = 0;
  public AccountListId?: number = 0;
  public JobRefId?: number = 0;
  public UnitPrice?: number = 0;
  public Reference?: string = ""
  public PaymentTypeRefId?: number = 0;

  public guid?: string = "";

  public PaymentTypeRef?: RefTableDTO = {};
  public AccountList?: AccountListDTO = {};
  public Item?: ItemsDTO = {};
  public JobRef?: RefTableDTO = {};
  public Poheader?: purchaseRequestHeaderDTO;

  public PrdetailsAttachments?: PrdetailsAttachmentsDTO[] = [];

  public PoOrderReceivedRef?: RefTableDTO = {}
  public PoOrderReceivedRefId?: number = 0;
  public ReceviedQty?: number = 0;
}

export class PrdetailsAttachmentsDTO {
  public PrdetAttachmentId?: number = 0;
  public PodetId?: number = 0;
  public Description?: string = ""

  public UniqueFileName?: string = ""

  public Podet?: PurchaseRequestDetailDTO = {};
}

export class PurchaseRequestAttachmentsDTO {
  public Id?: Number = 0;
  public PoheaderId?: Number = 0;
  // public Filename?:byte[] ;
  public UniqueFileName?: string = "";
  public Description?: string = "";
  public Poheader?: purchaseRequestHeaderDTO = {};
}

export class PurchaseOrderApprovalDTO {
  public ApprovalId?: Number = 0;
  public PoheaderId?: Number = 0;
  public ApprovalGroupId?: Number = 0;
  public ApprovalStatusRefId?: Number = 0;
  public OrderLevel?: Number = 0;
  public Remarks?: string = "";
  public ApprovedDate?: Date;
  public PostatusId?: Number = 0;

  public Postatus?: RefTableDTO = {};

  public ApprovedUser?: UserDetails = {};
  public ApprovalGroup?: ApprovalGroupsDTO = {};
  public ApprovalStatusRef?: RefTableDTO = {};
}


export class PoDTO {
  public Id?: Number = 0;
  public PoheaderId?: Number = 0;
  public Recipents?: string = "";
  public Subject?: string = "";
  public Cc?: string = "";
  public Body?: string = "";

  public Podetails?:PodetailsDTO[]=[];

}
export   class PodetailsDTO
{
    public  PodetailId ?: Number = 0;
    public  Poid ?: Number = 0;
    public  Description ?: string = "";
    public  UniqueFileName   ?: string = "";

}



// export class AttachemntDTO
// {
//     public    ID ?: Number = 0;

//     public   prid ?: Number = 0;
//     public   Descrition ?: string = "";

//     public   UniqueFileName ?: string = "";
// }
