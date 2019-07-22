import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './../service/auth/auth.service';
import { LoaderService } from './../service/loader/loader.service';
import { ToastService } from './../service/toast/toast.service';

import { environment } from "./../../../environments/environment"

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  private user = { UserName: '', Password: '' };

  constructor(
    private router: Router,
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

}
