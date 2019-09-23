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
  public asset: Asset;

  constructor(
    private assetService: AssetService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getAsset();
  }

  getAsset() {
    this.asset = this.assetService.getAsset(this.assetNumber);
  }

  getFullDate(dateString) {
    dateString = new Date(dateString);
    let date = "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    date += months[dateString.getMonth()] + " ";
    date += dateString.getDate() + ", ";
    date += dateString.getFullYear() + ", ";
    date += dateString.getUTCHours() + ":";
    date += dateString.getUTCMinutes() + " ";
    date += dateString.getUTCHours() < 12 ? 'AM': 'PM';

    return date;
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
