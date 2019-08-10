import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuController, NavController } from '@ionic/angular';

import { AuthService } from './../../services/auth/auth.service';
import { LoaderService } from './../../services/loader/loader.service';
import { ToastService } from './../../services/toast/toast.service';
import { UserService } from './../../../protected/services/user/user.service';
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
    private userService: UserService
  ) { }

  ngOnInit() {
    this.authenticatedSubscription = this.authService.authenticationState.subscribe((state) => {
      if (state) {
        this.menu.enable(true);
        this.navCtrl.navigateRoot('tabs');
        this.userService.getUserDetails().then((subscription) => {
          subscription.subscribe((user) => {
            this.userService.setUser(user[0]);
          });
        });
        this.authenticatedSubscription.unsubscribe();
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
        this.menu.enable(true);
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
