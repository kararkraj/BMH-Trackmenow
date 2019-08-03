import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { VehicleService } from './../../services/vehicle/vehicle.service';
import { Vehicle } from './../../services/vehicle/vehicle';
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

    public vehicles: Vehicle[];
    private vehicleSubscription;

    constructor(
        protected vehicleService: VehicleService,
        private router: Router,
        private loader: LoaderService,
        private toast: ToastService,
        private errorHandle: ErrorHandleService,
        private googleMap: GoogleMapService
    ) { }

    ngOnInit() {
        this.loader.startLoading().then(() => {
            this.vehicleService.getVehicles();
            this.vehicleService.updateVehiclesInterval();
            this.vehicleSubscription = this.vehicleService.isVehiclesPopulated.subscribe((state) => {
                if (state) {
                    this.vehicles = this.vehicleService.populateVehicles();
                    this.loader.stopLoading();
                }
            });
        });
    }

    ngOnDestroy() {
        console.log("Vehicle List destroyed");
        this.vehicleSubscription.unsubscribe();
        this.vehicleService.reset();
    }

    toggleVehicleSelection(vehicle) {
        this.vehicleService.toggleVehicleNumberSelection(vehicle.VehicleNumber);
    }

    startTrackingVehicles(vehicle?) {
        if (vehicle) {
            this.toggleVehicleSelection(vehicle);
        }
        if (this.googleMap.isMapInitialized()) {
            this.googleMap.startTrackingVehicles();
        } else {
            setTimeout(() => {
                this.googleMap.startTrackingVehicles();
            }, 2000);
        }
        this.router.navigate(['/protected/tabs/tabs/vehicle-map']);
    }

    stopTrackingVehicles() {
        this.vehicleService.clearSelectedVehicleNumbers();
        this.googleMap.stopTrackingVehicles();
    }

    changeTab() {
        this.router.navigate(['/protected/tabs/tabs/vehicle-map']);
    }

    getSelectedVehicleNumbers() {
        return this.vehicleService.getSelectedVehicleNumbers();
    }

    navigateToAddVehiclePage() {
        this.router.navigate(['/protected/add-vehicle']);
    }

}
