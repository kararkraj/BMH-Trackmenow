import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddVehicleService {

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  async getVehicleTypes() {
    let headers = new HttpHeaders();
    await this.storage.get(environment.apis.authToken).then((authToken) => {
      headers = headers.append("AuthorizeToken", authToken);
    });
    return this.http.get(environment.apis.baseApiUrl + environment.apis.getVehicleTypes, {
      headers: headers
    });
  }

  async getGPSDevices() {
    let headers = new HttpHeaders();
    await this.storage.get(environment.apis.authToken).then((authToken) => {
      headers = headers.append("AuthorizeToken", authToken);
    });
    return this.http.get(environment.apis.baseApiUrl + environment.apis.getGPSDevices, {
      headers: headers
    });
  }

  async addVehicle(vehicle) {
    let headers = new HttpHeaders();
    await this.storage.get(environment.apis.authToken).then((authToken) => {
      headers = headers.append("AuthorizeToken", authToken);
    });
    return this.http.post(environment.apis.baseApiUrl + environment.apis.addVehicle, vehicle, {
      headers: headers
    });
  }
}
