import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/secutiry.model';
import { SecurityService } from 'src/app/myShared/services/security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginViewModel: Login = {};
  constructor(private securityService: SecurityService, private router: Router) { }

  ngOnInit(): void {
    debugger
    this.securityService.LoginPage();
  }

  Login(): void {
    debugger
    this.loginViewModel={UserName:'admin',Password:'a'};
    this.securityService.Login(this.loginViewModel).subscribe(

      (item) => {
       // this.securityService.securityModel = item;

        this.router.navigate(['home']);
      },
      (error) => {
        //  this.confirmDialogService.messageBox("invalid username or password")
        alert("invalid user or server error")

      }
    );
  }

}
