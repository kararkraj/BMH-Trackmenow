import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AssetService } from './../../services/asset/asset.service';
import { Asset } from './../../services/asset/asset';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss'],
})
export class AssetDetailsComponent implements OnInit {

  @Input() assetNumber: string;
  public assetIndex: number;
  public date;

  constructor(
    public assetService: AssetService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.assetIndex = this.assetService.getAssetIndex(this.assetNumber);
    this.getFullDate();
    document.addEventListener('backbutton', () => {
      this.dismissModal();
    }, false);
  }

  getFullDate() {
    let dateString = new Date(this.assetService.assets[this.assetIndex].LatestGPSInfo.End.replace('Z', '+05:30'));
    let date = "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    date += months[dateString.getMonth()] + " ";
    date += dateString.getDate() + ", ";
    date += dateString.getFullYear() + ", ";
    date += dateString.getHours() < 10 ? "0" + dateString.getHours() + ":" : dateString.getHours() + ":";
    date += dateString.getMinutes() < 10 ? "0" + dateString.getMinutes() + " " : dateString.getMinutes() + " ";
    date += dateString.getHours() < 12 ? 'AM' : 'PM';

    this.date = date;
  }

  dismissModal() {
    this.modalController.dismiss();
  }

}
