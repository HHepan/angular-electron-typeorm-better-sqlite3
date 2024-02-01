import { Component } from '@angular/core';
import {refresh} from "electron-debug";
import {CommonService} from "../services/common.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLogin: string | null | undefined;
  constructor(private commonService: CommonService) {
    this.isLogin = window.sessionStorage.getItem('isLogin');
    this.commonService.passwordChanged$.subscribe(isChanged => {
      if (isChanged) {
        // this.isLogin = undefined;
      }
    })
  }

  receiveLoginMessage(isLogin: string) {
    this.isLogin = window.sessionStorage.getItem('isLogin');
    if (this.isLogin === null) {
      this.isLogin = isLogin;
    }
  }

}
