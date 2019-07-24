import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loader: LoaderService,
    private googleMap: GoogleMapService,
    private vehicleService: VehicleService
  ) {
    this.loader.startLoading().then(() => {
      const vehiclesSubscription = this.vehicleService.isVehiclesPopulated.subscribe((state) => {
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

  stopTrackingVehicle() {
    this.googleMap.stopTrackingVehicle();
    this.googleMap.fitMapBounds();
  }

  stopTrackingVehicles() {
    this.googleMap.stopTrackingVehicles();
    this.googleMap.fitMapBounds();
  }
}
