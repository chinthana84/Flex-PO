import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-approval-users',
  templateUrl: './approval-users.component.html',
  styleUrls: ['./approval-users.component.css']
})
export class ApprovalUsersComponent implements OnInit {

  constructor(  private http: HttpClient,private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe((params) => {

      this.http
      .get<any>(`${environment.APIEndpoint}/Admin/GetApprovalGroupsByID/` + params.id)
      .subscribe((data) => {
          console.log(data)
      }, (error) => {
       // this.confirmDialogService.messageBox(environment.APIerror)
      });





    });
  }

}
