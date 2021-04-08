import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridService } from 'src/app/grid/grid-service/grid.service';
import {
  RefTableDTO,
  VwGetRefDistinctDTO,
} from 'src/app/models/refTable.model';
import { ConfirmDialogService } from 'src/app/myShared/confirm-dialog/confirm-dialog.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ref-tables',
  templateUrl: './ref-tables.component.html',
  styleUrls: ['./ref-tables.component.css'],
})
export class RefTablesComponent implements OnInit {
  distnctRef: VwGetRefDistinctDTO[] = [];
  model: RefTableDTO[] = [];
  selectedRef: string = '';

  searchDescription: string = '';
  constructor(
    public route: ActivatedRoute,
    private toasterService: ToastrService,
    private router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private gridService: GridService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.http
      .get<VwGetRefDistinctDTO[]>(
        `${environment.APIEndpoint}/Admin/GetDistinctRefTables`
      )
      .subscribe(
        (data) => {
          this.distnctRef = data;
        },
        (error) => {
          this.confirmDialogService.messageBox(environment.APIerror);
        }
      );
  }

  getRefTable() {
    this.http
      .get<VwGetRefDistinctDTO[]>(
        `${environment.APIEndpoint}/Admin/GetRefByName/` + this.selectedRef
      )
      .subscribe(
        (data) => {
          this.model = data;
          console.log(data);
        },
        (error) => {
          this.confirmDialogService.messageBox(environment.APIerror);
        }
      );
  }

  Add() {
    if (this.model.filter((r) => r.RefId == 0).length > 0) {
      this.confirmDialogService.messageBox('already added new record');
    } else {
      let obj: RefTableDTO = {};
      obj.RefId = 0;
      obj.RefTableName = this.selectedRef;
      this.model.push(obj);
    }
  }

  onKey(event: any) {
    // without type info
    this.model = this.model.filter(
      (r) => r.RefDescription == event.target.value
    );
  }

  Save(obj: RefTableDTO) {
    this.http
      .post<any>(`${environment.APIEndpoint}/Admin/SaveRef`, obj, {})
      .subscribe(
        (data) => {
          if (data.IsValid == false) {

            this.confirmDialogService.messageListBox(data.ValidationMessages);
          } else {
            this.toasterService.success(environment.dataSaved);
            //this.router.navigate(['masterData']);
         
          }
        },
        (error) => {
          this.confirmDialogService.messageBox(environment.APIerror);
        }
      );
  }
}
