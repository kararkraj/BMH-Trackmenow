import { Injectable } from '@angular/core';

import { HttpService } from './../http/http.service';

import { environment } from './../../../environments/environment';

import { Asset } from './asset';

declare var google;

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  public assets: Asset[];
  public selectedAssets = [];
  public multipleSelection: boolean = false;
  private filterString: string = "";
  private updateAssetsInterval;

  public map;
  public markers = [];
  public selectedAssetMarker;
  private checkNetworkConnectivity;

  constructor(
    private httpService: HttpService
  ) {}

  updateAssets() {
    this.updateAssetsInterval = setInterval(() => {
      this.getAssets();
    }, 20000);
  }

  getAssets() {
    return new Promise((resolve) => {
      this.httpService.getAssets().subscribe((assets: Asset[]) => {
        console.log(assets);
        assets = assets.filter((asset) => {
          return asset.LatestGPSInfo !== null;
        });
        assets.forEach((asset: Asset) => {
          if (this.selectedAssets.includes(asset.VehicleNumber)) {
            asset.Selected = true;
          }
          if (asset.VehicleNumber.toLowerCase().includes(this.filterString)) {
            asset.Visible = true;
          }
        });
        this.assets = assets;
        this.updateAssetMarkers();
        resolve();
        console.log("Assets updated.");
      });
    });
  }

  toggleSelectedAssets(assetNumber) {
    if (this.selectedAssets.includes(assetNumber)) {
      this.selectedAssets.splice(this.selectedAssets.indexOf(assetNumber), 1);
    } else {
      this.selectedAssets.push(assetNumber);
    }
  }

  setMultipleSelection() {
    this.multipleSelection = (this.selectedAssets.length > 0);
  }

  selectAsset(assetNumber) {
    this.assets.forEach((asset) => {
      if (asset.VehicleNumber === assetNumber) {
        asset.Selected = true;
      }
    });
  }

  deselectAsset(assetNumber) {
    this.assets.forEach((asset) => {
      if (asset.VehicleNumber === assetNumber) {
        asset.Selected = false;
      }
    });
  }

  deselectAssets() {
    this.assets.forEach((asset) => {
      if (asset.Selected) {
        asset.Selected = false;
      }
    });
    this.selectedAssets = [];
  }

  setAllAssetsVisible() {
    this.assets.forEach((asset) => {
      if (!asset.Visible) {
        asset.Visible = true;
      }
    });
  }

  filterAssets(filterString) {
    this.setFilterString(filterString);
    this.assets.forEach((asset) => {
      if (asset.VehicleNumber.toLowerCase().includes(this.filterString)) {
        asset.Visible = true;
      } else {
        asset.Visible = false;
      }
    });
  }

  setFilterString(filterString) {
    this.filterString = filterString.toLowerCase();
  }

  resetFilterString() {
    this.filterString = "";
  }

  getAsset(assetNumber): Asset {
    return this.assets.find((asset: Asset) => {
      return (asset.VehicleNumber === assetNumber);
    });
  }

  getAssetIndex(assetNumber) {
    return this.assets.findIndex((asset: Asset, index) => {
      return asset.VehicleNumber === assetNumber;
    });
  }

  resetAssets() {
    clearInterval(this.updateAssetsInterval);
    this.assets = null;
    this.resetFilterString();
    this.selectedAssets = [];
    this.map = null;
    this.markers = [];
  }

  getAssetNumbers() {
    const assetNumbers = [];
    this.assets.forEach((asset) => {
      assetNumbers.push(asset.VehicleNumber);
    });
    return assetNumbers;
  }

  async initMap(element) {
    this.map = await new google.maps.Map(element.nativeElement, {
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    this.setShowAllAssetsControl();
    this.addMapAssets();
  }

  addMapAssets() {
    this.markers.forEach((marker) => {
      marker.setMap(this.map);
    })
  }

  generateAssetMarkers() {
    this.assets.forEach((asset) => {
      const icon = {
        url: this.getAssetUrl(asset.VehicleTypeName) + '-' + this.getAssetColor(asset) + '-' + this.getAssetRotation(asset.LatestGPSInfo.Degree) + '.png',
        scaledSize: new google.maps.Size(60, 60),
        anchor: new google.maps.Point(30, 30)
      };

      const marker = new google.maps.Marker({
        position: { lat: asset.LatestGPSInfo.Latitude, lng: asset.LatestGPSInfo.Longitude },
        map: this.map,
        icon: icon,
        title: asset.VehicleNumber,
        visible: true
      });
      this.markers.push(marker);
    });
  }

  updateAssetMarkers() {
    if (this.markers.length > 0) {
      this.assets.forEach((asset) => {
        this.updateAssetMarker(asset);
      });
    } else {
      this.generateAssetMarkers();
    }
  }

  updateAssetMarker(asset) {
    this.markers.forEach((marker) => {
      if (marker.title === asset.VehicleNumber) {
        const icon = {
          url: this.getAssetUrl(asset.VehicleTypeName) + '-' + this.getAssetColor(asset) + '-' + this.getAssetRotation(asset.LatestGPSInfo.Degree) + '.png',
          scaledSize: new google.maps.Size(60, 60),
          anchor: new google.maps.Point(30, 30)
        };
        marker.setIcon(icon);

        // const latOffset = (asset.LatestGPSInfo.Latitude - marker.getPosition().lat()) / 100;
        // const lngOffset = (asset.LatestGPSInfo.Longitude - marker.getPosition().lng()) / 100;

        // let currentLat = marker.getPosition().lat();
        // let currentLng = marker.getPosition().lng();
        // let count = 0;
        // const timer = setInterval(() => {
        //   count++;
        //   currentLat = currentLat + latOffset;
        //   currentLng = currentLng + lngOffset;

        //   const latlng = new google.maps.LatLng(currentLat, currentLng);
        //   marker.setPosition(latlng);

        //   if (count === 100) {
        //     clearInterval(timer);
        //   }
        // }, 20);
      }
    });
  }

  getAssetRotation(degree) {
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

  getAssetUrl(assetTypeName) {
    return "./assets/vehicles/" + assetTypeName.toLowerCase() + "/" + assetTypeName.toLowerCase();
  }

  getAssetColor(asset) {
    if (asset.LatestGPSInfo.Ignition === "0") {
      return "red";
    } else if (asset.LatestGPSInfo.Speed > 0) {
      return "green";
    } else {
      return "grey";
    }
  }

  trackAssets() {
    this.markers.forEach((marker) => {
      if (this.selectedAssets.includes(marker.title)) {
        marker.setMap(this.map);
      } else {
        marker.setMap(null);
      }
    });
  }

  stopTrackingAssets() {
    this.deselectAssets();
    this.markers.forEach((marker) => {
      if (!marker.getMap()) {
        marker.setMap(this.map);
      }
    });
  }

  trackAsset(assetNumber) {
    this.selectedAssetMarker = this.markers.find((marker) => {
      return marker.title == assetNumber;
    });
    // google.maps.event.addListener(this.selectedAssetMarker, 'position_changed', () => {
    //   this.fitMapBounds(this.selectedAssetMarker.getPosition());
    // });
  }

  stopTrackingAsset() {
    // google.maps.event.clearListeners(this.selectedAssetMarker, 'position_changed');
    this.selectedAssetMarker = null;
  }

  fitMapBounds(position?) {
    let mapBounds;
    if (position) {
      mapBounds = new google.maps.LatLngBounds(position);
    } else {
      mapBounds = new google.maps.LatLngBounds();
      this.markers.forEach((marker) => {
        if (marker.getMap()) {
          mapBounds.extend(marker.getPosition());
        }
      });
    }
    this.map.fitBounds(mapBounds);
  }

  setShowAllAssetsControl() {
    let controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.margin = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Reset map view';

    let controlDiv = document.createElement('div')
    controlDiv.appendChild(controlUI);

    let controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Show All Vehicles';
    controlUI.appendChild(controlText);

    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
    controlUI.addEventListener('click', () => {
      this.fitMapBounds();
    });
  }

}
