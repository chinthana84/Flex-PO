import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityService } from './services/security.service';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from './confirm-dialog/confirm-dialog.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [ConfirmDialogComponent],
  providers: [SecurityService, ConfirmDialogService]
})
export class MySharedModule { }

