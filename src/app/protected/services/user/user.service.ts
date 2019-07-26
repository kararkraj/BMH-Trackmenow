import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private header: HttpHeaders;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  async setHeaders() {
    return await this.storage.get(environment.apis.authToken).then((authToken) => {
      this.header = new HttpHeaders({
        AuthorizeToken: authToken
      });
    });
  }

  getUserDetails() {
    return this.http.get(environment.apis.baseApiUrl + environment.apis.getUserProfile, {
      headers: this.header
    });
  }
}
