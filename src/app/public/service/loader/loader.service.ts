import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading;

  constructor(
    public loadingController: LoadingController
  ) { }

  async startLoading() {
    this.loading = await this.loadingController.create({
      spinner: "bubbles",
      animated: true,
      message: '',
      translucent: true,
      cssClass: ''
    });
    await this.loading.present();
  }

  async stopLoading() {
    await this.loading.dismiss();
  }

}
