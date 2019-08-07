import { Router, RouterEvent } from '@angular/router';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

import { AuthService } from './public/services/auth/auth.service';
import { UserService } from './protected/services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appPages = [
    {
      title: 'MY PROFILE',
      url: '/my-profile',
      icon: 'person',
      detail: false,
      detailIcon: ""
    },
    {
      title: 'REPORTS',
      url: '',
      icon: 'paper',
      detail: true,
      detailIcon: "arrow-dropdown",
      hideSubPages: true,
      subPages: [
        {
          title: 'SPEED',
          url: 'tabs/vehicle-list',
        },
        {
          title: 'FUEL',
          url: 'tabs/vehicle-list',
        },
        {
          title: 'TRIP',
          url: 'tabs/vehicle-list',
        },
        {
          title: 'DISTANCE/KM',
          url: 'tabs/vehicle-list',
        },
      ]
    },
    {
      title: 'CONTACT US',
      url: '/contact-us',
      icon: 'call',
      detail: false,
      detailIcon: ""
    },
    {
      title: 'LOGOUT',
      url: '',
      icon: 'log-out',
      detail: false,
      detailIcon: ""
    }
  ];

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController,
    private menu: MenuController,
    public userService: UserService 
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#184F80');
      this.router.navigate(['']);
      this.userService.getUserDetails().then((subscription) => {
      subscription.subscribe((user) => {
        this.userService.setUser(user[0]);
      });
    });
    });
  }

  toggleSubPages() {
    this.appPages[1].hideSubPages = !this.appPages[1].hideSubPages;
  }

  async logout() {
    this.menu.close();
    const alert = await this.alertController.create({
      header: 'Logout?',
      message: 'Do you want to logout?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'YES',
          handler: () => {
            this.auth.logout().then(() => {
              this.router.navigate(['login']);
            });
          }
        }, {
          text: 'NO',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });

    await alert.present();
  }
}
