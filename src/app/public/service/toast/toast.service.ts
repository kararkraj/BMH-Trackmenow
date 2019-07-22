import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController
  ) { }

  async toastHandler(message, color, duration?) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration ? duration : 2000,
      color: color,
      keyboardClose: true
    });
    toast.present();
  }

}