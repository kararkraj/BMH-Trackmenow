import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authenticationState = new BehaviorSubject(false);

  constructor(
    private storage: Storage,
    private plt: Platform,
    private http: HttpClient
  ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(environment.apis.authToken).then((res) => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }

  setAuthToken(token) {
    return this.storage.set(environment.apis.authToken, token).then((res) => {
      this.authenticationState.next(true);
    });
  }

  login(user) {
    return this.http.post(environment.apis.baseApiUrl + environment.apis.login, user);
  }

  logout() {
    return this.storage.remove(environment.apis.authToken).then((res) => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }
}
