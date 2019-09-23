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
      animated: true,
      message: '',
      translucent: true,
    });
    this.loading.present();
  }

  async stopLoading() {
    await this.loading.dismiss();
  }

}
