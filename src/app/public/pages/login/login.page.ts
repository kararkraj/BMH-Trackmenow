import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';

import { AuthService } from './../../services/auth/auth.service';
import { LoaderService } from './../../services/loader/loader.service';
import { ToastService } from './../../services/toast/toast.service';

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
    private router: Router,
    private authService: AuthService,
    private loader: LoaderService,
    private toast: ToastService,
    private menu: MenuController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.authenticatedSubscription = this.authService.authenticationState.subscribe((state) => {
      console.log(state);
      if (state) {
        console.log(state);
        this.menu.enable(true);
        this.navCtrl.navigateRoot('tabs');
        // this.router.navigate(['', 'tabs']);
      }
    });
  }

  ngOnDestroy() {
    console.log("destroyed");
    this.authenticatedSubscription.unsubscribe();
  }

  onLogin(form: NgForm) {
    this.loader.startLoading();
    this.authService.login(this.user).subscribe((res) => {
      this.authService.setAuthToken(res["token"]).then((res) => {
        this.loader.stopLoading();
        this.menu.enable(true);
        this.router.navigate(['', 'tabs']);
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
