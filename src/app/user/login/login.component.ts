import { Observable } from 'rxjs';
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
  loginViewModel: Login = {} ;
  user = '';
  paw = '';
  constructor(private securityService: SecurityService, private router: Router) { }

  ngOnInit(): void {

    this.securityService.LoginPage();
  }

  Login(): void {

    this.loginViewModel = {  UserName: this.user, Password: this.paw };
    // tslint:disable-next-line: deprecation
    this.securityService.Login(this.loginViewModel).subscribe(

      (item) => {

        this.router.navigate(['home']);
      },
      (error) => {
        //  this.confirmDialogService.messageBox("invalid username or password")
        alert('invalid user or server error');

      }
    );
  }

}
