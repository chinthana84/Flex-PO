import { DisableButtonAfterClickDirective } from './directives/disableafterclick.directive';
import { AuthService } from './services/auth.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityService } from './services/security.service';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from './confirm-dialog/confirm-dialog.service';
import { FormsModule } from '@angular/forms';
import { NumericDirective } from './directives/numeric.directive';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { SearchPipe } from './pipes/filterFromList.pipe';
import { JwtHelperService } from '@auth0/angular-jwt';

@NgModule({
  declarations: [ConfirmDialogComponent,NumericDirective, LoaderComponent,SearchPipe,DisableButtonAfterClickDirective],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [ConfirmDialogComponent,NumericDirective,LoaderComponent,SearchPipe,DisableButtonAfterClickDirective],
  providers: [LoaderService,SecurityService, ConfirmDialogService,AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
})
export class MySharedModule { }

