import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridService } from 'src/app/grid/grid-service/grid.service';
import { ApprovalGroupsDTO, ApprovalGroupUsersDTO } from 'src/app/models/refTable.model';
import { UserDetails } from 'src/app/models/secutiry.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/myShared/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-approval-users',
  templateUrl: './approval-users.component.html',
  styleUrls: ['./approval-users.component.css']
})
export class ApprovalUsersComponent implements OnInit {

  model: ApprovalGroupsDTO = {};

  approvalGroups: ApprovalGroupsDTO[] = [];
  userDetails: UserDetails[] = [];
  approvalGroupID: number;
  selectedUserid: number;

 // selectedApprovalGroup: ApprovalGroupsDTO = {};

  constructor(private commonService: CommonService, public route: ActivatedRoute, private toasterService: ToastrService, public router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute, private gridService: GridService, private confirmDialogService: ConfirmDialogService) { }

  ngOnInit() {
    this.http
      .get<ApprovalGroupsDTO[]>(`${environment.APIEndpoint}/Admin/GetAllApprovalGroups`)
      .subscribe((data) => {
        this.approvalGroups = data;
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });

    this.http
      .get<UserDetails[]>(`${environment.APIEndpoint}/Admin/GetAllUsers`)
      .subscribe((data) => {
        this.userDetails = data;
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });


  }

  changeApprovalGroup(obj: any) {

    this.http
      .get<ApprovalGroupsDTO>(`${environment.APIEndpoint}/Admin/GetApprovalGroupsByID/` + this.approvalGroupID)
      .subscribe((data) => {
        debugger
        this.model = data;
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });

  }

  AddUser() {


    let obj = new ApprovalGroupUsersDTO();
    obj.UserId = this.selectedUserid;
    obj.ApprovalGroupId = this.approvalGroupID;
    obj.guid = this.commonService.newGuid();

    obj.User = {};
    obj.User = this.userDetails.filter(r => r.UserId == obj.UserId)[0];


    if (this.model.ApprovalGroupUsers == undefined) {
      this.model.ApprovalGroupUsers = [];
    }

    this.model.ApprovalGroupUsers.push(obj);

  }

  deleteApprovalUser(obj:ApprovalGroupUsersDTO){
    debugger

    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {

      if (obj.ApprovalGroupUserId>0){
        this.model.ApprovalGroupUsers=this.model.ApprovalGroupUsers.filter(r=> r.ApprovalGroupUserId != obj.ApprovalGroupUserId);
      }
      else{
        this.model.ApprovalGroupUsers=this.model.ApprovalGroupUsers.filter(r=> r.guid != obj.guid);
      }


    },
      function () { })



  }

  Save() {
    this.http
      .post<any>(`${environment.APIEndpoint}/Admin/SaveApprovalGroupUsers`, this.model.ApprovalGroupUsers, {})
      .subscribe((data) => {
        if (data.IsValid == false) {
          debugger
          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toasterService.show("SSS");
          this.router.navigate(['approvalGroupsUsers']);

        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });
  }

}