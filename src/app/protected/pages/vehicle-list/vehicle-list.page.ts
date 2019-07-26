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
    }

    populatevehicles() {
        return this.vehicleService.getVehicles().subscribe((res: Vehicle[]) => {
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
            // setTimeout(() => {
            //     this.googleMap.fitMapBounds();
            // }, 500);
        } else {
            setTimeout(() => {
                this.googleMap.startTrackingVehicles();
                // this.googleMap.fitMapBounds();
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

    getSelectedVehicleNumbers() {
        return this.vehicleService.getSelectedVehicleNumbers();
    }

    navigateToAddVehiclePage() {
        this.router.navigate(['/protected/add-vehicle']);
    }

}
