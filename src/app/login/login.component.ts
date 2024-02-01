import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {SystemService} from "../../services/system.service";
import {ElectronService} from "../../services/electron.service";
import {PasswordValidator} from "../../../app/utils/PasswordValidator";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = '海底电缆健康状态管理系统';
  isPasswordError = false;
  @Output() isLogin = new EventEmitter<string>();
  password = new FormControl('');
  systemPassword = '';
  init = false;

  constructor(private systemService: SystemService,
              private electronService: ElectronService) {
  }

  login() {
    if (this.password.value && PasswordValidator.validatePassword(this.password.value, this.systemPassword)) {
      this.isLogin.emit('true');
      window.sessionStorage.setItem('isLogin', String(true));
      // console.log('isLogin', window.sessionStorage.getItem('isLogin'));
      void this.electronService.ipcRenderer.invoke('login-success');
      void this.electronService.ipcRenderer.invoke('setMaximizable', true);
    } else {
      this.isPasswordError = true;
      console.log('密码错误，登录失败');
    }
  }

  ngOnInit(): void {
    this.systemService.getSystemItem('password')
      .subscribe((passwordItem) => {
        if (passwordItem && passwordItem.value) {
          this.systemPassword = passwordItem.value;
          this.init = true;
        }
      });
  }
}
