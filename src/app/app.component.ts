import { Component } from '@angular/core';
import { Platform, NavController, MenuController, AlertController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';

import { HttpService } from './services/http/http.service';
import { AssetService } from './services/asset/asset.service';

import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  private initiating: boolean;
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
    private alertController: AlertController,
    public http: HttpService,
    private assetService: AssetService,
    private splashScreen: SplashScreen,
    private nav: NavController,
    private menu: MenuController,
    private network: Network
  ) {
    this.initializeApp();
    this.checkNetwork();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.network.type == "none") {
        this.initiating = false;
      } else {
        this.initiating = true;
      }
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#184F80');
      this.splashScreen.hide();
      this.http.getAuthenticated().then((authenticated) => {
        if (authenticated) {
          this.http.getUserDetails().subscribe((res) => {
            this.http.setUser(res[0]);
            this.menu.enable(true);
            this.nav.navigateRoot('tabs');
          });
        } else {
          this.menu.enable(false);
          this.nav.navigateRoot('login');
        }
      });
    });
  }

  checkNetwork() {
    this.network.onDisconnect().subscribe(() => {
      this.http.toastHandler(environment.messages.networkIssues, "secondary", 0);
    });
    this.network.onConnect().subscribe(() => {
      this.http.dismissToast();
      if (!this.initiating) {
        this.assetService.getAssets().then(() => {
          this.assetService.updateAssets();
        });
      }
    });
  }

  toggleSubPages() {
    this.appPages[1].hideSubPages = !this.appPages[1].hideSubPages;
  }

  async logout() {
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
            this.http.startLoading().then(() => {
              this.http.logout();
              this.assetService.resetAssets();
              this.menu.enable(false);
              this.nav.navigateRoot('login').then(() => {
                this.http.stopLoading();
              });
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
