import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyNavigations } from './grid/gridModels/gridOption.model';
import { Login, SecurityModel } from './models/secutiry.model';
import { CommonService } from './myShared/services/common.service';
import { SecurityService } from './myShared/services/security.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Flex-PO';
  currentObj: SecurityModel = {}
  myNavigations:MyNavigations;

  constructor(public securityService: SecurityService,public commonService: CommonService,
    private router: Router) { }



  ngOnInit(): void {
    debugger
   this.myNavigations= this.commonService.GetAllNavigations()

    this.securityService.currentSecurityObject.subscribe((r) => {

      this.currentObj = r;

      if (this.currentObj.IsAuthenticated==false){
        let u= localStorage.getItem("usernameFlex")??"";
        let pw = localStorage.getItem("pwFlex")??"";

        if (u.length >0 && pw.length >0)
        {
          let objUser:Login={ };

          objUser.UserName=u??"";
          objUser.Password=pw??"";

          this.securityService
          .Login(objUser)
          .subscribe((r) => {
            this.currentObj = r;
           }, (error) => {
                  this.router.navigate(["login"]); });
        }else{
          this.router.navigate(["login"]);
        }
      }




    });



}



  }


