import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { VehicleService } from './../../services/vehicle/vehicle.service';
import { GoogleMapService } from './../../services/google-map/google-map.service';
import { LoaderService } from './../../../public/services/loader/loader.service';
import { ToastService } from './../../../public/services/toast/toast.service';
import { ErrorHandleService } from './../../../public/services/errorHandle/error-handle.service';
import { environment } from './../../../../environments/environment';

declare var google;

@Component({
    selector: 'app-vehicle-list',
    templateUrl: './vehicle-list.page.html',
    styleUrls: ['./vehicle-list.page.scss'],
})
export class VehicleListPage {

    private vehicles;

    constructor(
        private vehicleService: VehicleService,
        public router: Router,
        public loader: LoaderService,
        public toast: ToastService,
        public errorHandle: ErrorHandleService,
        private googleMap: GoogleMapService
    ) {
        this.loader.startLoading().then(() => {
            const vehicleSubscription = this.vehicleService.isVehiclesPopulated.subscribe((state) => {
                if (state) {
                    this.vehicles = this.vehicleService.populateVehicles();
                    this.loader.stopLoading();
                }
            });
        });
    }

    populatevehicles() {
        return this.vehicleService.getVehicles().subscribe((res) => {
            this.vehicles = res;
        }, (error) => {
            console.log(this.errorHandle.errorHandle(error));
            this.toast.toastHandler(this.errorHandle.errorHandle(error), "warning");
        });
    }

    toggleVehicleSelection(vehicle) {
        this.vehicleService.toggleVehicleNumberSelection(vehicle.VehicleNumber);
    }

    startTrackingVehicles(vehicle?) {
        if (vehicle) {
            this.toggleVehicleSelection(vehicle);
        }
        this.router.navigate(['/protected/tabs/tabs/vehicle-map']);
        if (this.googleMap.isMapInitialized()) {
            this.googleMap.startTrackingVehicles();
            const timeout = setTimeout(() => {
                this.googleMap.fitMapBounds();
                clearTimeout();
            }, 500);
        } else {
            const timeout = setTimeout(() => {
                this.googleMap.startTrackingVehicles();
                this.googleMap.fitMapBounds();
                clearTimeout(timeout);
            }, 2000);
        }
    }

    stopTrackingVehicles() {
        this.vehicleService.clearSelectedVehicleNumbers();
        this.googleMap.stopTrackingVehicles();
    }

    changeTab() {
        this.router.navigate(['/protected/tabs/tabs/vehicle-map']);
    }

}
