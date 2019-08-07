import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { environment } from './../../../../environments/environment';
import { User } from './user';
@Injectable({
  providedIn: 'root'
})
export class UserService {

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
    private storage: Storage
  ) { }

  async getUserDetails() {
    let headers = new HttpHeaders();
    await this.storage.get(environment.apis.authToken).then((authToken) => {
      headers = headers.append("AuthorizeToken", authToken);
    });
    return this.http.get(environment.apis.baseApiUrl + environment.apis.getUserProfile, {
      headers: headers
    });
  }

  setUser(user: User) {
    this.user = user;
  }
}
