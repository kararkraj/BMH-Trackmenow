import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

import { VehicleService } from './../../services/vehicle/vehicle.service';

declare var google;

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {

    @ViewChild('vehicleTabs') vehicleTabs: IonTabs;
    public filterText;

    constructor(
        private vehicleService: VehicleService
    ) { }

    filterVehicles() {
        if (this.filterText) {
            this.vehicleService.filterVehicles(this.filterText);
        } else {
            this.vehicleService.setAllVehiclesVisible();
            this.vehicleService.resetFilterString();
        }
    }

}
