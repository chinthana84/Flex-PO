import { GridOptions } from 'src/app/grid/gridModels/gridOption.model';
import { Grid3Service } from 'src/app/grid/grid-service/grid3.service';

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { SearchObject } from '../gridModels/searchObject.model';
import { GridService } from '../grid-service/grid.service';
import { Grid } from '../gridModels/grid.model'; 
import { Grid2Service } from '../grid-service/grid2.service';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css']
})
export class PagerComponent implements OnInit {
  @Input()
  serviceID?: number = 0;
  gridoption: GridOptions = {};
  gridoption2: GridOptions = {};

  gridoptionList:GridOptions[]=[];


  @Input()
  assosiatedGridIDXXX: string="";




  uploadComplete(pageno: number) {




    if (this.serviceID == 2) {
      this.gridoption2.searchObject.pageNo = pageno;
      this.gridService2.reloadGrid(this.gridoption2)
    } else {
      this.gridoption.searchObject.pageNo = pageno;
      this.gridService.reloadGrid(this.gridoption)
    }
  }



  constructor(private gridService: GridService, private gridService2: Grid2Service,private gridSercie3:Grid3Service) {



  }

  ngOnInit() {
    // this.gridService.getGridOptions().subscribe(r => {

    //   this.gridoption = r;
    // });

    // this.gridService2.getGridOptions().subscribe(r => {

    //   this.gridoption2 = r;
    // });

    this.gridSercie3.getGridOptionsXXX().subscribe(r => {
      if(r!= undefined && r.filter(a=> a.gridID == this.assosiatedGridIDXXX).length>0)
      {

        this.gridoption =r.filter(a=> a.gridID == this.assosiatedGridIDXXX)[0];
        this.gridoptionList=r;


      }
    });

  }

  public getCurrent(){

    let obj=this.gridoptionList.filter(r=> r.gridID==this.assosiatedGridIDXXX)[0];
   return (this.gridoptionList.filter(r=> r.gridID==this.assosiatedGridIDXXX)[0]);
  }

}
