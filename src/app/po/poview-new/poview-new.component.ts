import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Grid3Service } from 'src/app/grid/grid-service/grid3.service';
import { PodetailsDTO, PoDTO } from 'src/app/models/purchaseRequestHeaderDTO.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/myShared/services/common.service';
import { FileuploadService } from 'src/app/myShared/services/fileupload.service';
import { ItemService } from 'src/app/myShared/services/item.service';
import { PrService } from 'src/app/myShared/services/pr.service';
import { TypeheadService } from 'src/app/myShared/services/typehead.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-poview-new',
  templateUrl: './poview-new.component.html',
  styleUrls: ['./poview-new.component.css']
})
export class POViewNewComponent implements OnInit {
  private subs = new SubSink();

  @Input() poFROMPARANT:PoDTO={};
@Input() YourReadOnly:Boolean=false;

  constructor(private modalService: NgbModal, private confirmDialogService: ConfirmDialogService, private typeheadService: TypeheadService
    , private http: HttpClient,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private itemService: ItemService,
    public commonService: CommonService,
    public fileuploadService: FileuploadService,
    public gridService: Grid3Service,
    public prService:PrService) { }

  ngOnInit(): void {
  }

  AddPORowAttachemtns(){
    let obj = new PodetailsDTO();
    this.poFROMPARANT.Podetails.push(obj);
  }

  addFilePO(event, i: PodetailsDTO): void {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      this.fileuploadService
        .upload(file).subscribe(res => { i.UniqueFileName = String(res); });
    }
  }

  createPOEmail() {
     this.subs.sink = this.http
       .post<any>(`${environment.APIEndpoint}/PurchaseRequest/CreatePOWithEmail`, this.poFROMPARANT, {}).subscribe((data) => {
         if (data.IsValid == false) {
           this.confirmDialogService.messageListBox(data.ValidationMessages)
         }
         else {
           this.toastr.success(environment.dataSaved);
           //this.router.navigate(['MyTasks']);
           location.reload();

         }
       }, (error) => { this.confirmDialogService.messageBox(environment.APIerror) });
   }
}
