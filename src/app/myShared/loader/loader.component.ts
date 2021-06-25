import { Component, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

//   constructor(private loaderService: LoaderService) { }
//   isLoadingRequest:boolean=false; //this.loaderService.isLoadingRequest;

//   ngOnInit(): void {

//  this.loaderService.main$.subscribe(r=>{

//   this.isLoadingRequest=r;
//  })

//   }
constructor(private loaderService: LoaderService) { }

ngOnInit(): void {
}

isLoading: Subject<boolean> = this.loaderService.isLoadingRequest;




}
