import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AddVehicleService } from './../../services/add-vehicle/add-vehicle.service';
import { ToastService } from './../../../public/services/toast/toast.service';
import { LoaderService } from './../../../public/services/loader/loader.service';

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
  public devices;

  constructor(
    private addVehicleService: AddVehicleService,
    private toast: ToastService,
    private loader: LoaderService
  ) { }

  ngOnInit() {
    this.getVehicleTypes();
    this.getGPSDevices();
  }

  getVehicleTypes() {
    this.addVehicleService.getVehicleTypes().then((subscription) => {
      subscription.subscribe((vehicleTypes) => {
        this.vehicleTypes = vehicleTypes;
      });
    });
  }

  getGPSDevices() {
    this.addVehicleService.getGPSDevices().then((subscription) => {
      subscription.subscribe((devices) => {
        console.log(devices);
        this.devices = devices;
      });
    });
  }

  addVehicle() {
    this.loader.startLoading().then(() => {
      this.addVehicleService.addVehicle(this.addVehicleForm.value).then((subscription) => {
        subscription.subscribe((devices) => {
          console.log(devices);
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
