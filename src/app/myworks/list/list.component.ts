
import { Component, OnInit } from '@angular/core';
import { GridService } from 'src/app/grid/grid-service/grid.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(public gridService: GridService) { }

  ngOnInit(): void {
  }

}
