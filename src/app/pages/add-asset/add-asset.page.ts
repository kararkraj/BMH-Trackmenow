import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { HttpService } from './../../services/http/http.service';
import { ToastService } from './../../services/toast/toast.service';
import { LoaderService } from './../../services/loader/loader.service';
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
    private http: HttpService,
    private toast: ToastService,
    private loader: LoaderService
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
        this.toast.toastHandler(environment.messages.noDevices, "secondary")
      }
    });
  }

  addAsset() {
    this.loader.startLoading().then(() => {
      this.http.addAsset(this.addAssetForm.value).subscribe((res) => {
        this.loader.stopLoading();
        this.toast.toastHandler(environment.messages.assetAdded, "tertiary");
      }, (error) => {
        this.loader.stopLoading();
        this.toast.toastHandler(environment.messages.somethingWrong, "danger");
      });
    });
  }

  reset() {
    this.addAssetForm.reset();
  }

}
