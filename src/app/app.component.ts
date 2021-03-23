import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login, SecurityModel } from './models/secutiry.model';
import { SecurityService } from './myShared/services/security.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Flex-PO';
  currentObj: SecurityModel = {}

  constructor(public securityService: SecurityService,
    private router: Router) { }

  ngOnInit(): void {

    this.securityService.currentSecurityObject.subscribe((r) => {
       
      this.currentObj = r;

      if (this.currentObj.IsAuthenticated==false){
        let u= localStorage.getItem("username")??"";
        let pw = localStorage.getItem("pw")??"";

        if (u.length >0 && pw.length >0)
        {
          let objUser:Login={ };

          objUser.UserName=u??"";
          objUser.Password=pw??"";

          this.securityService
          .Login(objUser)
          .subscribe((r) => { this.currentObj = r;  });
        }else{
          this.router.navigate(["login"]);
        }
      }




    });



}



  }


