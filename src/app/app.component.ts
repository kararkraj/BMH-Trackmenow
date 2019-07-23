import { Router, RouterEvent } from '@angular/router';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthService } from './public/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appPages = [
    {
      title: 'MY PROFILE',
      url: 'protected/tabs/vehicle-list',
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
          url: 'protected/tabs/vehicle-list',
        },
        {
          title: 'FUEL',
          url: 'protected/tabs/vehicle-list',
        },
        {
          title: 'TRIP',
          url: 'protected/tabs/vehicle-list',
        },
        {
          title: 'DISTANCE/KM',
          url: 'protected/tabs/vehicle-list',
        },                        
      ]
    },
    {
      title: 'CONTACT US',
      url: 'protected/tabs/vehicle-list',
      icon: 'call',
      detail: false,
      detailIcon: ""
    },
    {
      title: 'LOGOUT',
      url: 'protected/tabs/vehicle-list',
      icon: 'log-out',
      detail: false,
      detailIcon: ""
    }
  ];

  private activatedMenuPath:string;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private auth: AuthService,
    private router: Router
  ) {
    this.initializeApp();
    this.router.events.subscribe((event: RouterEvent) => {
      this.activatedMenuPath = event.url;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#184F80');
      this.auth.authenticationState.subscribe(state => {
        if (state) {
          this.router.navigate(['protected', 'tabs']);
        } else {
          this.router.navigate(['login']);
        }
      });
    });
  }

  toggleSubPages() {
    this.appPages[1].hideSubPages = !this.appPages[1].hideSubPages;
  }
}
