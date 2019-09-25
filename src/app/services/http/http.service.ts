import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

import { User } from './user';

import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public headers: HttpHeaders;
  private authenticated: boolean = false;
  private loading;

  public user: User = {
    "Firstname": "",
    "LastName": "",
    "UserName": "",
    "Email": "",
    "MobileNo": 0,
    "Address": "",
    "Pincode": 0,
    "CompanyName": "",
    "TotalVehicles": 0
  };

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private loader: LoadingController,
    private toast: ToastController
  ) {}

  setAuthenticated(authToken) {
    this.storage.set(environment.apis.authToken, authToken);
    this.headers = new HttpHeaders({
      "AuthorizeToken": authToken
    });
    this.authenticated = true;
  }

  getAuthenticated() {
    return new Promise((resolve) => {
      this.storage.get(environment.apis.authToken).then(async (authToken) => {
        resolve(authToken);
      });
    });
  }

  removeAuthToken() {
    return this.storage.remove(environment.apis.authToken);
  }

  login(user) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.login, user);
  }

  logout() {
    this.removeAuthToken().then(() => {
      this.authenticated = false;
      this.headers.delete("AuthorizeToken");
      this.resetUser();
    });
  }

  isAuthenticated() {
    return this.authenticated;
  }

  getAssets() {
    return this.http.get((environment.apis.baseApiUrl) + environment.apis.getAssets, {
      headers: this.headers
    });
  }

  getUserDetails() {
    return this.http.get(environment.apis.baseApiUrl + environment.apis.getUserProfile, {
      headers: this.headers
    });
  }

  updateUserDetails(data) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.updateUserProfile, data, {
      headers: this.headers
    });
  }

  setUser(user: User) {
    this.user = user;
  }

  resetUser() {
    this.user = {
      "Firstname": "",
      "LastName": "",
      "UserName": "",
      "Email": "",
      "MobileNo": 0,
      "Address": "",
      "Pincode": 0,
      "CompanyName": "",
      "TotalVehicles": 0
    }
  }

  getAssetType() {
    return this.http.get(environment.apis.baseApiUrl + environment.apis.getAssetType, {
      headers: this.headers
    });
  }

  getGPSDevices() {
    return this.http.get(environment.apis.baseApiUrl + environment.apis.getGPSDevices, {
      headers: this.headers
    });
  }

  addAsset(asset) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.addAsset, asset, {
      headers: this.headers
    });
  }

  getFuelReport(data) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.fuelReport, data, {
      headers: this.headers
    });
  }

  getSpeedReport(data) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.speedReport, data, {
      headers: this.headers
    });
  }

  getDistanceReport(data) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.distanceReport, data, {
      headers: this.headers
    });
  }

  contact(data) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.contactUs, data, {
      headers: this.headers
    });
  }

  errorHandle(error) {
    // network errors
      // 1) net::ERR_NETWORK_CHANGED
      // 2) net::ERR_INTERNET_DISCONNECTED
    switch (error.status) {
      case 401:
        return environment.messages.credentialsMismatch;
      default:
        return environment.messages.somethingWrong;
    }
  }

  async startLoading() {
    this.loading = await this.loader.create({
      animated: true,
      message: '',
      translucent: true,
    });
    this.loading.present();
  }

  async stopLoading() {
    await this.loading.dismiss();
  }

  async toastHandler(message, color, duration?) {
    const toast = await this.toast.create({
      message: message,
      duration: duration ? duration : 2000,
      color: color,
      keyboardClose: true
    });
    toast.present();
  }
}
