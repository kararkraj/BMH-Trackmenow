import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandleService {

  constructor(
    private network: Network
  ) { }
  
  errorHandle(error) {
    if (error.status === 0) {
      if (!this.network.type) {
        return environment.messages.noInternet;
      }
    }
    return environment.messages.somethingWrong;
  }
}
