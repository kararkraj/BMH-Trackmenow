import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { AssetService } from './../../services/asset/asset.service';
import { HttpService } from './../../services/http/http.service';

import { AssetDetailsComponent } from './../../components/asset-details/asset-details.component';

declare var google;

@Component({
  selector: 'app-asset-map',
  templateUrl: './asset-map.page.html',
  styleUrls: ['./asset-map.page.scss']
})
export class AssetMapPage {

  @ViewChild('mapElement') mapNativeElement: ElementRef;

  private subscription;
  private routerSubscription;

  constructor(
    private http: HttpService,
    public assetService: AssetService,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.http.startLoading().then(() => {
      this.initMap(this.mapNativeElement).then(() => {
        this.generateAssetMarkers();
        this.routerSubscription = this.activatedRoute.queryParams.subscribe((params) => {
          if (params.assetNumber === "multipleAssets") {
            this.startTrackingAssets();
          } else if (params.assetNumber) {
            this.startTrackingAsset(this.assetService.selectedAssets[0]);
          } else {
            this.fitMapBounds();
          }
        });
        this.http.stopLoading();
      });
    });
    this.subscription = this.assetService.assetsLoaded.subscribe((state) => {
      if (state) {
        this.updateAssetMarkers();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  async initMap(element) {
    this.assetService.map = await new google.maps.Map(element.nativeElement, {
      center: { lat: 19.9409388, lng: 72.82819189999998 },
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  }

  generateAssetMarkers() {
    this.assetService.assets.forEach((asset) => {
      this.generateAssetMarker(asset);
    });
  }

  generateAssetMarker(asset) {
    const icon = {
      url: this.getIconUrl(asset.VehicleTypeName) + '-' + this.getIconColor(asset) + '-' + this.getMarkerOrigin(asset.LatestGPSInfo.Degree) + '.png',
      scaledSize: new google.maps.Size(60, 60),
      anchor: new google.maps.Point(30, 30),
      animation: "DROP"
    };

    const marker = new google.maps.Marker({
      position: { lat: asset.LatestGPSInfo.Latitude, lng: asset.LatestGPSInfo.Longitude },
      map: this.assetService.map,
      icon: icon,
      title: asset.VehicleNumber,
      animation: google.maps.Animation.DROP,
      visible: true
    });

    marker.addListener('click', (event) => {
      this.startTrackingAsset(marker.title);
    });
    this.assetService.markers.push(marker);
  }

  updateAssetMarkers() {
    this.assetService.assets.forEach((asset) => {
      this.updateAssetMarker(asset);
    });
  }

  updateAssetMarker(asset) {
    this.assetService.markers.forEach((marker) => {
      if (marker.title === asset.VehicleNumber) {

        const icon = {
          url: this.getIconUrl(asset.VehicleTypeName) + '-' + this.getIconColor(asset) + '-' + this.getMarkerOrigin(asset.LatestGPSInfo.Degree) + '.png',
          scaledSize: new google.maps.Size(60, 60),
          anchor: new google.maps.Point(30, 30),
          animation: "DROP"
        };
        marker.setIcon(icon);

        const latOffset = (asset.LatestGPSInfo.Latitude - marker.getPosition().lat()) / 100;
        const lngOffset = (asset.LatestGPSInfo.Longitude - marker.getPosition().lng()) / 100;

        let currentLat = marker.getPosition().lat();
        let currentLng = marker.getPosition().lng();
        let count = 0;
        const timer = setInterval(() => {
          count++;
          currentLat = currentLat + latOffset;
          currentLng = currentLng + lngOffset;

          const latlng = new google.maps.LatLng(currentLat, currentLng);
          marker.setPosition(latlng);

          if (count === 100) {
            clearInterval(timer);
          }
        }, 20);
      }
    });
  }

  getMarkerAchor(assetType) {
    switch (assetType) {
      case 0:
        return new google.maps.Point(0, 0);
      case 1: //BAG
        return new google.maps.Point(20, 40);
      case 2:
        return new google.maps.Point(40, 40);
    }
  }

  getIconRotation(degree) {
    return (Math.round(degree / 10) * 10) === 0 ? 360 : (Math.round(degree / 10) * 10);
  }

  getMarkerOrigin(degree) {
    switch (Math.round(degree / 45)) {
      case 0:
        return 0;
      case 1:
        return 45;
      case 2:
        return 90;
      case 3:
        return 135;
      case 4:
        return 180;
      case 5:
        return 225;
      case 6:
        return 270;
      case 7:
        return 315;
      default:
        return 0;
    }
  }

  getIconUrl(assetTypeName) {
    return "./assets/vehicles/" + assetTypeName.toLowerCase() + "/" + assetTypeName.toLowerCase();
  }

  getIconColor(asset) {
    if (asset.LatestGPSInfo.Ignition === "0") {
      return "red";
    } else if (asset.LatestGPSInfo.Speed > 0) {
      return "green";
    } else {
      return "grey";
    }
  }

  fitMapBounds() {
    const mapBounds = new google.maps.LatLngBounds();
    this.assetService.map.fitBounds(mapBounds);
    this.assetService.markers.forEach((marker) => {
      if (marker.getVisible()) {
        mapBounds.extend(marker.getPosition());
      }
    });
    this.assetService.map.fitBounds(mapBounds);
  }

  setMapZoom(zoom) {
    this.assetService.map.setZoom(zoom);
  }

  panMap() {
    this.assetService.map.panTo(this.assetService.selectedAssetMarker.getPosition());
  }

  panMapBounds() {
    const mapBounds = new google.maps.LatLngBounds();
    this.assetService.markers.forEach((marker) => {
      if (marker.getVisible()) {
        mapBounds.extend(marker.getPosition());
      }
    });
    this.assetService.map.panToBounds(mapBounds);
  }

  startTrackingAsset(assetNumber) {
    this.stopTrackingAsset();
    this.assetService.selectedAssetMarker = this.assetService.markers.find((marker) => {
      return marker.title == assetNumber;
    });
    this.panMap();
    // const listener = google.maps.event.addListener(this.assetService.map, 'idle', () => {
      this.setMapZoom(15);
      // listener.remove();
      this.presentAssetDetailModal(assetNumber).then((modal) => {
        modal.present();
        modal.onDidDismiss().then(() => {
          this.stopTrackingAsset();
        });
      });
    // });
    google.maps.event.addListener(this.assetService.selectedAssetMarker, 'position_changed', () => {
      this.assetService.map.panTo(this.assetService.selectedAssetMarker.getPosition());
    });
  }

  stopTrackingAsset() {
    if (this.assetService.selectedAssetMarker) {
      if (this.assetService.selectedAssets.length == 1) {
        this.assetService.deselectAssets();
      }
      google.maps.event.clearListeners(this.assetService.selectedAssetMarker, 'position_changed')
      this.assetService.selectedAssetMarker = null;
    }
    this.fitMapBounds();
  }

  startTrackingAssets() {
    this.stopTrackingAsset();
    this.assetService.markers.forEach((marker) => {
      if (!this.assetService.selectedAssets.includes(marker.title)) {
        marker.setVisible(false);
      } else {
        marker.setVisible(true);
      }
    });
    this.fitMapBounds();
  }

  stopTrackingAssets() {
    this.assetService.deselectAssets();
    this.assetService.markers.forEach((marker) => {
      marker.setVisible(true);
    });
    this.fitMapBounds();
  }

  async presentAssetDetailModal(assetNumber) {
    const modal = await this.modalController.create({
      component: AssetDetailsComponent,
      componentProps: {
        'assetNumber': assetNumber
      },
      animated: true,
      cssClass: 'asset-details-modal',
      showBackdrop: false
    });
    return modal;
  }

  dismissAssetDetailModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  resetMap() {
    this.assetService.map = null;
    this.assetService.markers = [];
    this.assetService.selectedAssetMarker = null;
  }
}
