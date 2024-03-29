import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridService } from 'src/app/grid/grid-service/grid.service';
import { ApprovalGroupsDTO, ApprovalGroupUsersDTO, SecurityGroupsDTO, SecurityGroupsUserDetailsDTO } from 'src/app/models/refTable.model';
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
  securityGroupsUsers:SecurityGroupsUserDetailsDTO[]=[];
  securityGroups: SecurityGroupsDTO[] = [];
  approvalGroups: ApprovalGroupsDTO[] = [];

  approvalGroupID: number;

  selectedSG:number;

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
      .get<SecurityGroupsDTO[]>(`${environment.APIEndpoint}/Admin/GetAllSecurityGroups`)
      .subscribe((data) => {
        this.securityGroups = data;
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });
  }

  GetUsersBySG(selectedSG:number){

    this.http
      .get<SecurityGroupsUserDetailsDTO[]>(`${environment.APIEndpoint}/Admin/GetUserDetailsBySecurityGroupID/` + this.selectedSG)
      .subscribe((data) => {

        this.securityGroupsUsers = data;
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });
  }

  changeApprovalGroup(obj: any) {

    if(this.approvalGroupID==0) return;

    this.http
      .get<ApprovalGroupsDTO>(`${environment.APIEndpoint}/Admin/GetApprovalGroupsByID/` + this.approvalGroupID)
      .subscribe((data) => {

        this.model = data;
      }, (error) => {
        this.confirmDialogService.messageBox(environment.APIerror)
      });

  }

  AddUser(objx:SecurityGroupsUserDetailsDTO) {


      let obj = new ApprovalGroupUsersDTO();
    // obj.UserId = this.selectedUserid;
      obj.ApprovalGroupId = this.approvalGroupID;
      obj.guid = this.commonService.newGuid();
      obj.UserId=objx.UserId;
      obj.User=objx.User;
    // obj.User = {};
    // obj.User = this.userDetails.filter(r => r.UserId == obj.UserId)[0];


    if (this.model.ApprovalGroupUsers == undefined) {
      this.model.ApprovalGroupUsers = [];
    }

  if(  this.model.ApprovalGroupUsers.filter(r=> r.UserId == objx.UserId).length >0){
    this.confirmDialogService.messageBox("User already exists")
  }

else{
  this.model.ApprovalGroupUsers.push(obj);
}


  }

  deleteApprovalUser(obj:ApprovalGroupUsersDTO){


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
      .post<any>(`${environment.APIEndpoint}/Admin/SaveApprovalGroupUsers`, this.model, {})
      .subscribe((data) => {
        if (data.IsValid == false) {

          this.confirmDialogService.messageListBox(data.ValidationMessages)
        }
        else {
          this.toasterService.success(environment.dataSaved);
          this.router.navigate(['approvalGroupsUsers']);
          window.location.reload();
        }
      }, (error) => {

        this.confirmDialogService.messageBox(environment.APIerror)
      });
  }

}
