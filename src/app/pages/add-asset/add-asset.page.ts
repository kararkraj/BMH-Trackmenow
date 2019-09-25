import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { HttpService } from './../../services/http/http.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.page.html',
  styleUrls: ['./add-asset.page.scss']
})
export class AddAssetPage implements OnInit {

  public asset = "Vehicle";
  public assetTypes;
  public addAssetForm = new FormGroup({
    "AssetNumber": new FormControl('', Validators.required),
    "IMEI": new FormControl(''),
    "AssetTypeId": new FormControl('', Validators.required),
    "TankCapacity": new FormControl(null)
  });
  public devices = [];

  constructor(
    private http: HttpService
  ) { }

  ngOnInit() {
    this.getAssetTypes();
    this.getGPSDevices();
  }

  getAssetTypes() {
    this.http.getAssetType().subscribe((res) => {
      this.assetTypes = res;
    });
  }

  getGPSDevices() {
    this.http.getGPSDevices().subscribe((res: []) => {
      if (res.length > 0) {
        res.forEach((device) => {
          if (!device["VehicleNumber"]) {
            this.devices.push(device)
          }
        });
      }
      if (this.devices.length === 0) {
        this.http.toastHandler(environment.messages.noDevices, "secondary")
      }
    });
  }

  addAsset() {
    this.http.startLoading().then(() => {
      this.http.addAsset(this.addAssetForm.value).subscribe((res) => {
        this.http.stopLoading();
        this.http.toastHandler(environment.messages.assetAdded, "tertiary");
      }, (error) => {
        this.http.stopLoading();
        this.http.toastHandler(environment.messages.somethingWrong, "danger");
      });
    });
  }

  reset() {
    this.addAssetForm.reset();
  }

}
