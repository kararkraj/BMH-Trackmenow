import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HttpService } from './../http/http.service';

import { environment } from './../../../environments/environment';

import { Asset } from './asset';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  public assets: Asset[];
  public assetsLoaded = new BehaviorSubject(false);
  public selectedAssets = [];
  private filterString: string = "";
  private updateAssetsInterval;

  public map;
  public markers = [];
  public selectedAssetMarker;

  constructor(
    private httpService: HttpService
  ) { }

  updateAssets() {
    this.updateAssetsInterval = setInterval(() => {
      this.getAssets();
    }, 20000);
  }

  getAssets() {
    return new Promise((resolve) => {
      this.httpService.getAssets().subscribe((assets: Asset[]) => {
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
        resolve();
        this.assetsLoaded.next(true);
        console.log("Assets updated.");
      });
    });
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

  resetAssets() {
    clearInterval(this.updateAssetsInterval);
    this.assets = null;
    this.assetsLoaded.next(false);
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
}
