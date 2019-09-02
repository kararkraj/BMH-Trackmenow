import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { HttpService } from './../../services/http/http.service';
import { ToastService } from './../../../public/services/toast/toast.service';
import { LoaderService } from './../../../public/services/loader/loader.service';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.page.html',
  styleUrls: ['./add-vehicle.page.scss']
})
export class AddVehiclePage implements OnInit {

  public vehicleTypes;
  public addVehicleForm = new FormGroup({
    "VehicleNumber": new FormControl('', Validators.required),
    "IMEI": new FormControl(''),
    "VehicleTypeId": new FormControl('', Validators.required),
    "TankCapacity": new FormControl(null)
  });
  public devices = [];

  constructor(
    private http: HttpService,
    private toast: ToastService,
    private loader: LoaderService
  ) { }

  ngOnInit() {
    this.getVehicleTypes();
    this.getGPSDevices();
  }

  getVehicleTypes() {
    this.http.getVehicleTypes().then((subscription) => {
      subscription.subscribe((vehicleTypes) => {
        this.vehicleTypes = vehicleTypes;
      });
    });
  }

  getGPSDevices() {
    this.http.getGPSDevices().then((subscription) => {
      subscription.subscribe((devices: []) => {
        if (devices.length > 0) {
          devices.forEach((device) => {
            if (!device["VehicleNumber"]) {
              this.devices.push(device)
            }
          });
        }
        if (this.devices.length === 0) {
          this.toast.toastHandler(environment.messages.noDevices, "secondary")
        }
      });
    });
  }

  addVehicle() {
    this.loader.startLoading().then(() => {
      this.http.addVehicle(this.addVehicleForm.value).then((subscription) => {
        subscription.subscribe((res) => {
          this.loader.stopLoading();
          this.toast.toastHandler("Vehicle added successfully.", "tertiary");
        }, (error) => {
          this.loader.stopLoading();
          this.toast.toastHandler("Something went wrong. Please try again.", "danger");
        });
      });
    });
  }

  reset() {
    this.addVehicleForm.reset();
  }

}
