import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
  }

  async setHeaders() {
    if (this.headers) {
      return await true;
    } else {
      await this.storage.get(environment.apis.authToken).then((authToken) => {
        this.headers = new HttpHeaders({
          "AuthorizeToken": authToken
        });
      });
    }
  }

  async getVehicleTypes() {
    await this.setHeaders();
    return this.http.get(environment.apis.baseApiUrl + environment.apis.getVehicleTypes, {
      headers: this.headers
    });
  }

  async getGPSDevices() {
    await this.setHeaders();
    return this.http.get(environment.apis.baseApiUrl + environment.apis.getGPSDevices, {
      headers: this.headers
    });
  }

  async addVehicle(vehicle) {
    await this.setHeaders();
    return this.http.post(environment.apis.baseApiUrl + environment.apis.addVehicle, vehicle, {
      headers: this.headers
    });
  }

  async getFuelReport(data) {
    await this.setHeaders();
    return this.http.post(environment.apis.baseApiUrl + environment.apis.fuelReport, data, {
      headers: this.headers
    });
  }

  async getSpeedReport(data) {
    await this.setHeaders();
    return this.http.post(environment.apis.baseApiUrl + environment.apis.speedReport, data, {
      headers: this.headers
    });
  }

  async getDistanceReport(data) {
    await this.setHeaders();
    return this.http.post(environment.apis.baseApiUrl + environment.apis.distanceReport, data, {
      headers: this.headers
    });
  }
}
