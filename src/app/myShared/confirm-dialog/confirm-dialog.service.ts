import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { DialogMessage } from './confirm-dialog.component';

@Injectable() export class ConfirmDialogService {
  private subject = new Subject<DialogMessage>();

  confirmThis(message: string, yesFn: () => void, noFn: () => void): any {

      this.setConfirmation(message, yesFn, noFn,"confirm");
  }


  setConfirmation(message: string, yesFn: () => void, noFn: () => void,msgtype:string): any {
     
      const that = this;
      this.subject.next({
          type: msgtype,
          msg: message,

          yesFn(): any {
                  that.subject.next(); // This will close the modal
                  yesFn();
              },
          noFn(): any {
              that.subject.next();
              noFn();
          }
      });

  }



  messageBox(message: string): any {
    debugger
      this.setBox(message,function (){},"ok")
  }
  setBox(message: string, noFn: () => void, msgtype:string): any {
    const that = this;
    this.subject.next({
      msg: message,
      type: msgtype
      , noFn(): any {
        that.subject.next();
        noFn();
      }
    });
  }


  messageListBox(message: string[]): any {
    this.setListBox(message, function () { }, "list")
  }

  setListBox(message: string[], noFn: () => void, msgtype:string): any {
    const that = this;
    this.subject.next({
      msgList: message,
      type: msgtype
      , noFn(): any {
        that.subject.next();
        noFn();
      }
    });
  }





  getMessage(): Observable<DialogMessage> {
    return this.subject.asObservable();
  }
}
