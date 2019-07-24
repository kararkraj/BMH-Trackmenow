import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
import { HttpClientModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { VehicleDetailsComponentModule } from './protected/components/vehicle-details/vehicle-details.module';
import { VehicleDetailsComponent } from './protected/components/vehicle-details/vehicle-details.component';

@NgModule({
  declarations: [AppComponent],
    entryComponents: [VehicleDetailsComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    VehicleDetailsComponentModule
  ],
  providers: [
    StatusBar,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
