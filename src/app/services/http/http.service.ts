import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
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
  public authenticated = new BehaviorSubject(false);

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
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.setAuthToken();
    });
  }

  setAuthToken(authToken?) {
    if (authToken) {
      this.headers = new HttpHeaders({
        "AuthorizeToken": authToken
      });
      return this.storage.set(environment.apis.authToken, authToken).then(() => {
        this.authenticated.next(true);
      });
    } else {
      this.storage.get(environment.apis.authToken).then((authToken) => {
        if (authToken) {
          this.headers = new HttpHeaders({
            "AuthorizeToken": authToken
          });
          this.authenticated.next(true);
        }
      });
    }
  }

  removeAuthToken() {
    return this.storage.remove(environment.apis.authToken);
  }

  login(user) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.login, user);
  }

  logout() {
    this.removeAuthToken().then(() => {
      this.authenticated.next(false);
      this.headers.delete("AuthorizeToken");
      this.resetUser();
    });
  }

  isAuthenticated() {
    return this.authenticated.value;
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
    switch (error.status) {
      case 401:
        return environment.messages.credentialsMismatch;
      default:
        return environment.messages.somethingWrong;
    }
  }
}
