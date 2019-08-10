import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { VehicleService } from './../../services/vehicle/vehicle.service';
import { Vehicle } from './../../services/vehicle/vehicle';
import { GoogleMapService } from './../../services/google-map/google-map.service';
import { LoaderService } from './../../../public/services/loader/loader.service';

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
        this.vehicleSubscription.unsubscribe();
        this.vehicleService.reset();
    }

    toggleVehicleSelection(vehicleNumber) {
        this.vehicleService.toggleVehicleNumberSelection(vehicleNumber);
    }

    trackVehicles() {
        if (this.googleMap.isMapInitialized()) {
            this.googleMap.startTrackingVehicles();
        } else {
            setTimeout(() => {
                this.googleMap.startTrackingVehicles();
            }, 2000);
        }
        this.router.navigate(['tabs/tabs/vehicle-map']);
    }

    selectVehicles(vehicleNumber) {
        if (this.vehicleService.getSelectedVehicleNumbers().length >= 1) {
            this.vehicleService.toggleVehicleNumberSelection(vehicleNumber);
        } else {
            this.vehicleService.toggleVehicleNumberSelection(vehicleNumber);
            this.trackVehicles();
        }
    }

    stopTrackingVehicles() {
        this.vehicleService.clearSelectedVehicleNumbers();
        this.googleMap.stopTrackingVehicles();
    }

    getSelectedVehicleNumbers() {
        return this.vehicleService.getSelectedVehicleNumbers();
    }

    navigateToAddVehiclePage() {
        this.router.navigate(['/add-vehicle']);
    }

    getBalanceFuelPercent(balanceFuel, tankCapacity) {
        return Math.round(balanceFuel*100/tankCapacity) + '%';
    }

}
