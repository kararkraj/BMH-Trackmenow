import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { catchError } from 'rxjs/operators';

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
    private toastCtrl: ToastController
  ) { }

  setAuthenticated(authToken) {
    return this.storage.set(environment.apis.authToken, authToken).then(() => {
      this.setHeaders(authToken);
    });
  }

  setHeaders(authToken) {
    this.authenticated = true;
    this.headers = new HttpHeaders({
      "AuthorizeToken": authToken
    });
  }

  getAuthenticated() {
    return new Promise((resolve) => {
      this.storage.get(environment.apis.authToken).then(async (authToken) => {
        if (authToken) {
          this.setHeaders(authToken);
          resolve(true);
        } else {
          resolve(false);
        }
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
    }).pipe(
      catchError((err) => this.errorHandle(err))
    );
  }

  getUserDetails() {
    return this.http.get(environment.apis.baseApiUrl + environment.apis.getUserProfile, {
      headers: this.headers
    }).pipe(
      catchError((err) => this.errorHandle(err))
    );
  }

  updateUserDetails(data) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.updateUserProfile, data, {
      headers: this.headers
    }).pipe(
      catchError((err) => this.errorHandle(err))
    );
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
    }).pipe(
      catchError((err) => this.errorHandle(err))
    );
  }

  getGPSDevices() {
    return this.http.get(environment.apis.baseApiUrl + environment.apis.getGPSDevices, {
      headers: this.headers
    }).pipe(
      catchError((err) => this.errorHandle(err))
    );
  }

  addAsset(asset) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.addAsset, asset, {
      headers: this.headers
    }).pipe(
      catchError((err) => this.errorHandle(err))
    );
  }

  getFuelReport(data) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.fuelReport, data, {
      headers: this.headers
    }).pipe(
      catchError((err) => this.errorHandle(err))
    );
  }

  getSpeedReport(data) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.speedReport, data, {
      headers: this.headers
    }).pipe(
      catchError((err) => this.errorHandle(err))
    );
  }

  getDistanceReport(data) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.distanceReport, data, {
      headers: this.headers
    }).pipe(
      catchError((err) => this.errorHandle(err))
    );
  }

  contact(data) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.contactUs, data, {
      headers: this.headers
    }).pipe(
      catchError((err) => this.errorHandle(err))
    );
  }

  errorHandle(error?) {
    // network errors
    // 1) net::ERR_NETWORK_CHANGED
    // 2) net::ERR_INTERNET_DISCONNECTED
    // 3) net::ERR_NAME_NOT_RESOLVED
    // 4) net::ERR_TIMED_OUT
    // 5) net::ERR_CONNECTION_RESET 200 (OK)
    let message;
    switch (error.status) {
      case 401:
        message = environment.messages.credentialsMismatch;
        this.toastHandler(message, "secondary");
        break;
      case 0:
        message = environment.messages.networkIssues;
        break;
      default:
        message = environment.messages.somethingWrong;
        this.toastHandler(message, "secondary");
    }
    this.stopLoading();
    return message;
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
    this.toastCtrl.getTop().then(async (toast) => {
      if (toast) {
        toast.dismiss();
      } else {
        let toast = await this.toastCtrl.create({
          message: message,
          duration: duration ? duration : (duration == 0 ? 0 : 2000),
          color: color,
          keyboardClose: true
        });
        return toast.present();
      }
    });
  }

  dismissToast() {
    this.toastCtrl.getTop().then((toast) => {
      if (toast) {
        toast.dismiss();
      }
    });
  }
}
