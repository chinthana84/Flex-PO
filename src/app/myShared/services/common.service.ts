import { Injectable } from '@angular/core';
import { MyNavigations } from 'src/app/grid/gridModels/gridOption.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() {}

  public GetAllNavigations(){
    return new MyNavigations();
  }

  public newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


}



