import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { MyNavigations } from './grid/gridModels/gridOption.model';
import { Login, SecurityModel } from './models/secutiry.model';
import { CommonService } from './myShared/services/common.service';
import { SecurityService } from './myShared/services/security.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Flex-PO';
  currentObj: SecurityModel = {};


  displayBreadcrumbList: Array<any>;
  route: string = "";
  initialUrl: string = "";
  masterBreadcrumbList: Array<any>;

  constructor(
    public securityService: SecurityService,
    public commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setBreadcrumb();
    debugger;

    this.securityService.currentSecurityObject.subscribe((r) => {
      this.currentObj = r;

      if (this.currentObj.IsAuthenticated == false) {
        let u = localStorage.getItem('usernameFlex') ?? '';
        let pw = localStorage.getItem('pwFlex') ?? '';

        if (u.length > 0 && pw.length > 0) {
          let objUser: Login = {};

          objUser.UserName = u ?? '';
          objUser.Password = pw ?? '';

          this.securityService.Login(objUser).subscribe(
            (r) => {
              this.currentObj = r;
            },
            (error) => {
              this.router.navigate(['login']);
            }
          );
        } else {
          this.router.navigate(['login']);
        }
      }
    });
  }

  setBreadcrumb() {

    this.router.events.subscribe((routeEvent: RoutesRecognized) => {
     if (!(routeEvent instanceof RoutesRecognized)) return;


      let route = routeEvent.state.root;
      let dispayname: string = ""
      dispayname = route.firstChild.data["titleKey"]
 
      if (dispayname==undefined){

        if (route.queryParams.rptUI_ID==undefined){
          dispayname="name not found"
        }else{
        //dispayname=this.ReportsUIs.filter(r=> r.ID== route.queryParams.rptUI_ID)[0].Name
        }
      }


        this.displayBreadcrumbList = [];
        if (routeEvent.url !== "") {
        //  this.route = location.pathname;
        this.route = routeEvent.url;
          this.masterBreadcrumbList = this.route.split("/");
          this.masterBreadcrumbList = this.masterBreadcrumbList.slice(
            1,
            this.masterBreadcrumbList.length
          );


          // for (let i = 0; i < this.masterBreadcrumbList.length; i++) {
            for (let i = 0; i < 1; i++) {

            if (this.masterBreadcrumbList[i] != 'pro' && this.masterBreadcrumbList[i] != 'edit') {
              if (i !== 0) {
                this.initialUrl = this.displayBreadcrumbList[i - 1];
              } else {
                this.initialUrl = "/";
              }

              if (this.initialUrl == undefined) {
                this.initialUrl = "";
              }

              const breadCrumbObj = {
                name:  dispayname,
                url: this.initialUrl + this.masterBreadcrumbList[i],
                id: i,
              };

              this.displayBreadcrumbList.push(breadCrumbObj);
            }

          }
        } else {
          this.route = "/Home";
        }


    });
  }



  decodeurl(url:string){
    if (url.indexOf("&") >0 ){
     return
    }
    else
    {
     this.router.navigate([url])
    }


   }
}
