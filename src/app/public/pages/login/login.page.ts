import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from './../../services/auth/auth.service';
import { LoaderService } from './../../services/loader/loader.service';
import { ToastService } from './../../services/toast/toast.service';

import { environment } from "./../../../../environments/environment"

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  public user = { UserName: '', Password: '' };

  constructor(
    private authService: AuthService,
    private loader: LoaderService,
    private toast: ToastService,
  ) { }

  onLogin(form: NgForm) {
    this.loader.startLoading();
    this.authService.login(this.user).subscribe((res) => {
      this.authService.setAuthToken(res["token"]).then((res) => {
        this.loader.stopLoading();
      });
    }, (error) => {
      console.log(error);
      this.loader.stopLoading();
      this.toast.toastHandler(environment.messages.credentialsMismatch, "secondary");
    });
  }

  clearUser() {
    this.user.UserName = '';
    this.user.Password = '';
  }

}
