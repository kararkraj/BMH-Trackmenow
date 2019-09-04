import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuController, NavController } from '@ionic/angular';

import { AuthService } from './../../services/auth/auth.service';
import { LoaderService } from './../../services/loader/loader.service';
import { ToastService } from './../../services/toast/toast.service';
import { HttpService } from './../../../protected/services/http/http.service';
import { environment } from "./../../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  public user = { UserName: '', Password: '' };
  private authenticatedSubscription;

  constructor(
    private authService: AuthService,
    private loader: LoaderService,
    private toast: ToastService,
    private menu: MenuController,
    private navCtrl: NavController,
    private http: HttpService
  ) { }

  ngOnInit() {
    this.authenticatedSubscription = this.authService.authenticationState.subscribe((state) => {
      if (state) {
        this.menu.enable(true);
        this.navCtrl.navigateRoot('tabs');
        this.http.getUserDetails().then((subscription) => {
          subscription.subscribe((user) => {
            this.http.setUser(user[0]);
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.authenticatedSubscription.unsubscribe();
  }

  onLogin(form: NgForm) {
    this.loader.startLoading();
    this.authService.login(this.user).subscribe((res) => {
      this.authService.setAuthToken(res["token"]).then((res) => {
        this.loader.stopLoading();
      });
    }, (error) => {
      this.loader.stopLoading();
      this.toast.toastHandler(environment.messages.credentialsMismatch, "secondary");
    });
  }

  clearUser() {
    this.user.UserName = '';
    this.user.Password = '';
  }

}
