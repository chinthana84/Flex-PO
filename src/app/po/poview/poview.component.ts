import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { PoDTO } from 'src/app/models/purchaseRequestHeaderDTO.model';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-poview',
  templateUrl: './poview.component.html',
  styleUrls: ['./poview.component.css']
})
export class PoviewComponent implements OnInit {
  private subs = new SubSink();
  @Input() fromParent:PoDTO={};




  constructor(private http:HttpClient) {

 


  }

  ngOnInit(): void {






  }

}
