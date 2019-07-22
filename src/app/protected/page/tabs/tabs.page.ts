import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

import { VehicleService } from './../../service/vehicle/vehicle.service';
import { AuthService } from './../../../public/service/auth/auth.service';

declare var google;

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {

    @ViewChild('vehicleTabs') vehicleTabs: IonTabs;

    private filterText;

    constructor(
        private authService: AuthService,
        private vehicleService: VehicleService
    ) { }

    tabChange() {
        console.log(this.vehicleTabs.getSelected());
    }

    logout() {
        this.authService.logout();
    }

    filterVehicles() {
        if (this.filterText) {
            this.vehicleService.filterVehicles(this.filterText);
        } else {
            this.vehicleService.setAllVehiclesVisible();
            this.vehicleService.resetFilterString();
        }
    }

}
