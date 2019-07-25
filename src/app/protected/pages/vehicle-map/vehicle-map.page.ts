import { Component, ElementRef, ViewChild } from '@angular/core';

import { VehicleService } from './../../services/vehicle/vehicle.service';
import { GoogleMapService } from "./../../services/google-map/google-map.service";
import { LoaderService } from './../../../public/services/loader/loader.service';

declare var google;

@Component({
  selector: 'app-vehicle-map',
  templateUrl: './vehicle-map.page.html',
  styleUrls: ['./vehicle-map.page.scss']
})
export class VehicleMapPage {

  @ViewChild('mapElement') mapNativeElement: ElementRef;
  private vehicleSubscription;

  constructor(
    private loader: LoaderService,
    private googleMap: GoogleMapService,
    private vehicleService: VehicleService
  ) { }

  ngOnInit() {
    this.loader.startLoading().then(() => {
      this.vehicleSubscription = this.vehicleService.isVehiclesPopulated.subscribe((state) => {
        if (state) {
          if (!this.googleMap.isMapInitialized()) {
            this.googleMap.initMap(this.mapNativeElement).then(() => {
              this.googleMap.locateVehicles();
              this.loader.stopLoading();
            });
          } else {
            this.googleMap.updateVehicleMarkers();
            this.loader.stopLoading();
          }
        }
      });
    });
  }

  ngOnDestroy() {
    this.vehicleSubscription.unsubscribe();
  }

  stopTrackingVehicle() {
    this.googleMap.stopTrackingVehicle();
    this.googleMap.fitMapBounds();
  }

  stopTrackingVehicles() {
    this.googleMap.stopTrackingVehicles();
    this.googleMap.fitMapBounds();
  }

  isVehicleBeingTracked() {
    return this.googleMap.isVehicleBeingTracked;
  }

  getSelectedVehicleNumbers() {
    return this.vehicleService.getSelectedVehicleNumbers();
    }
}
