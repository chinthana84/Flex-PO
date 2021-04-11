import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  constructor(private http:HttpClient) { }

  public addFile(x: FileList) {
    debugger
    let fileList: FileList = x;
    var ret=""
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);

     return this.upload(file);
    }
  }

  upload(fileToUpload: any) {

    let input = new FormData();
    input.append("file", fileToUpload);

    return this.http
      .post(`${environment.APIEndpoint}/Upload/UploadFile`, input);
  }

  downloadFile(filename) {

    //   return this.http.get(this.url + '/GetImage?image=' + image, {
    //     responseType: 'blob'
    // });

        this.http.get(`${environment.APIEndpoint}/Upload/Download/` + filename
        , {
          responseType: 'blob'
        }).subscribe(x=> {
debugger
          const url= window.URL.createObjectURL(x);
          window.open(url);
         // return x;
        });

    }
}
