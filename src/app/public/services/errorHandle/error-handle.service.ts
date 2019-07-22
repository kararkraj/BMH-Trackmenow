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

  private connectSubscription = this.network.onConnect().subscribe((res) => {
    console.log("Got network");
    console.log(res);
  });
  private disconnectSubscription = this.network.onDisconnect().subscribe((res) => {
    console.log("Network lost");
    console.log(res);
  });

  errorHandle(error) {
    if (error.status === 0) {
      if (!this.network.type) {
        return environment.messages.noInternet;
      }
    }
    return environment.messages.somethingWrong;
  }
}
