import { Component, OnInit, Input } from '@angular/core';
import { VehicleService } from './../../services/vehicle/vehicle.service';
import { Vehicle } from './../../services/vehicle/vehicle';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss'],
})
export class VehicleDetailsComponent implements OnInit {

  @Input() VehicleNumber: string;
  private vehicle: Vehicle;

  constructor(
    private vehicleService: VehicleService
  ) { }

  ngOnInit() {
    console.log(this.VehicleNumber);
    this.getVehicle();
  }

  getVehicle() {
    this.vehicle = this.vehicleService.getVehicle(this.VehicleNumber);
  }

}
