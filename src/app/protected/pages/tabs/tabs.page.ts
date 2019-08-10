import { Component } from '@angular/core';

import { VehicleService } from './../../services/vehicle/vehicle.service';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {

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
