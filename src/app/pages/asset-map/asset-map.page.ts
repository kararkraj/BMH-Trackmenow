import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { AssetService } from './../../services/asset/asset.service';
import { HttpService } from './../../services/http/http.service';

import { AssetDetailsComponent } from './../../components/asset-details/asset-details.component';

@Component({
  selector: 'app-asset-map',
  templateUrl: './asset-map.page.html',
  styleUrls: ['./asset-map.page.scss']
})
export class AssetMapPage {

  @ViewChild('mapElement') mapNativeElement: ElementRef;
  private routerSubscription;
  public multipleSelection: boolean = false;

  constructor(
    private http: HttpService,
    public assetService: AssetService,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.http.startLoading().then(() => {
      this.assetService.initMap(this.mapNativeElement).then(() => {
        this.addAssetClickEvents();
        this.http.stopLoading();
        this.routerSubscription = this.activatedRoute.queryParams.subscribe((params) => {
          if (params.assetNumber === "multipleAssets") {
            this.trackAssets();
          } else if (params.assetNumber) {
            this.trackAsset(params.assetNumber);
          } else {
            setTimeout(() => {
              this.assetService.fitMapBounds();
            }, 100);
          }
        });
      });
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  addAssetClickEvents() {
    this.assetService.markers.forEach((marker) => {
      marker.addListener('click', () => {
        this.trackAsset(marker.title);
      });
    });
  }

  trackAsset(assetNumber) {
    this.assetService.trackAsset(assetNumber);
    this.presentAssetDetailModal(assetNumber).then((modal) => {
      modal.present();
      modal.onDidDismiss().then(() => {
        this.assetService.stopTrackingAsset();
      });
    });
  }

  trackAssets() {
    this.assetService.setMultipleSelection();
    this.assetService.trackAssets();
    setTimeout(() => {
      this.assetService.fitMapBounds();
    }, 100);
  }

  stopTrackingAssets() {
    this.assetService.stopTrackingAssets();
    this.assetService.setMultipleSelection();
    this.assetService.fitMapBounds();
  }

  async presentAssetDetailModal(assetNumber) {
    const modal = await this.modalController.create({
      component: AssetDetailsComponent,
      componentProps: {
        assetNumber: assetNumber
      },
      animated: true,
      cssClass: 'asset-details-modal',
      showBackdrop: false
    });
    return modal;
  }
}
