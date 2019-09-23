import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';

import { LoaderService } from './../../services/loader/loader.service';
import { ToastService } from './../../services/toast/toast.service';
import { HttpService } from './../../services/http/http.service';
import { environment } from "./../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  public user = { UserName: '', Password: '' };

  constructor(
    private loader: LoaderService,
    private toast: ToastService,
    private menu: MenuController,
    private http: HttpService,
    private router: Router
  ) { }

  login() {
    this.loader.startLoading().then(() => {
      this.http.login(this.user).subscribe((res) => {
        this.http.setAuthToken(res["token"])
        this.loader.stopLoading();
      }, (error) => {
        this.loader.stopLoading();
        this.toast.toastHandler(this.http.errorHandle(error), "secondary");
      });
    });
  }

  clearUser() {
    this.user.UserName = '';
    this.user.Password = '';
  }

}
