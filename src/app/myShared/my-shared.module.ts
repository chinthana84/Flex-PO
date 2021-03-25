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

@NgModule({
  declarations: [ConfirmDialogComponent,NumericDirective, LoaderComponent,SearchPipe],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [ConfirmDialogComponent,NumericDirective,LoaderComponent,SearchPipe],
  providers: [LoaderService,SecurityService, ConfirmDialogService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
})
export class MySharedModule { }

