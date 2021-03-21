import { Grid } from './grid.model';

export class SearchObject {
  searchColName?: string;
  searchText?: string;
  pageNo?: number;
  girdId?: number;
  defaultSortColumnName?: string;
  passingId?: number;
  passingString?: string;
  colNames?:   Grid[]=[];


  saveID?:number=0;
  SavedDBColumn?:string="";

}
