import { AccountListDTO, RefTableDTO } from './../../models/refTable.model';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/myShared/services/common.service';
import { TypeheadService } from 'src/app/myShared/services/typehead.service';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-poitem',
  templateUrl: './poitem.component.html',
  styleUrls: ['./poitem.component.css']
})
export class PoitemComponent implements OnInit {
  private subs = new SubSink();
  AccountCodes:AccountListDTO[]=[];
  JobCOdes :RefTableDTO[]=[];

  constructor(private modalService: NgbModal, private confirmDialogService: ConfirmDialogService, private typeheadService: TypeheadService
    , private http: HttpClient,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,

    public commonService: CommonService) { }

  ngOnInit(): void {



    this.subs.sink = this.http
    .get<any>(`${environment.APIEndpoint}/Admin/GetAllAccountList/` )
    .subscribe((data) => { this.AccountCodes = data; }, (error) => {
      this.confirmDialogService.messageBox(environment.APIerror)
    });


    this.http.get<RefTableDTO[]>(`${environment.APIEndpoint}/Admin/GetRefByName/` + 'Job Codes').subscribe(
      r=>{this.JobCOdes=r;},  (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });


  }

  AddITems(){
    
  }

}
