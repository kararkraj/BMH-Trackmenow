import { Router, RouterEvent } from '@angular/router';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AlertController, MenuController } from '@ionic/angular';

import { HttpService } from './services/http/http.service';
import { AssetService } from './services/asset/asset.service';
import { LoaderService } from './services/loader/loader.service';

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
          url: '/speed-report',
        },
        {
          title: 'FUEL',
          url: '/fuel-report',
        },
        {
          title: 'TRIP',
          url: 'tabs/vehicle-list',
        },
        {
          title: 'DISTANCE/KM',
          url: '/distance-report',
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
    private router: Router,
    private alertController: AlertController,
    private menu: MenuController,
    public http: HttpService,
    private assetService: AssetService,
    private splashScreen: SplashScreen,
    private loader: LoaderService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#184F80');
      this.splashScreen.hide();
      const subscription = this.http.authenticated.subscribe((state) => {
        if (state) {
            this.http.getUserDetails().subscribe((res) => {
              this.http.setUser(res[0]);
              this.menu.enable(true);
              this.router.navigate(['tabs']);
            });
        } else {
          this.router.navigate(['login']);
        }
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
          text: 'NO',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'YES',
          handler: () => {
            this.http.logout();
            this.assetService.resetAssets();
            this.menu.enable(false);
          }
        }
      ]
    });

    await alert.present();
  }
}
