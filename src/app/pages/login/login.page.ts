import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, MenuController } from '@ionic/angular';

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
    private http: HttpService,
    private nav: NavController,
    private menu: MenuController
  ) {}

  login() {
    this.http.startLoading().then(() => {
      this.http.login(this.user).subscribe((res) => {
        this.http.setAuthenticated(res["token"]);
          this.http.getUserDetails().subscribe((res) => {
            this.http.setUser(res[0]);
            this.nav.navigateRoot('tabs').then(() => {
              this.menu.enable(true); 
            });
            this.http.stopLoading();
          });
      }, (error) => {
        this.http.stopLoading();
        this.http.toastHandler(this.http.errorHandle(error), "secondary");
      });
    });
  }

  ngOnDestroy() {
    this.clearUser();
  }

  clearUser() {
    this.user.UserName = '';
    this.user.Password = '';
  }

}
