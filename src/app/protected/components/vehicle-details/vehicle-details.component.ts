import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { VehicleService } from './../../services/vehicle/vehicle.service';
import { Vehicle } from './../../services/vehicle/vehicle';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss'],
})
export class VehicleDetailsComponent implements OnInit {

  @Input() VehicleNumber: string;
  public vehicle: Vehicle;
  private vehicleSubscription;

  constructor(
    private vehicleService: VehicleService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getVehicle();
    this.vehicleSubscription = this.vehicleService.isVehiclesPopulated.subscribe((state) => {
      console.log("subscribe");
      this.vehicle = this.vehicleService.getVehicle(this.VehicleNumber);
    });
  }

  ngOnDestroy() {
    this.vehicleSubscription.unsubscribe();
  }

  getVehicle() {
    this.vehicle = this.vehicleService.getVehicle(this.VehicleNumber);
  }

  getFullDate(dateString) {
    dateString = new Date(dateString);
    let date = "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    date += months[dateString.getMonth()] + " ";
    date += dateString.getDate() + ", ";
    date += dateString.getFullYear() + ", ";
    date += dateString.getUTCHours() + ":";
    date += dateString.getUTCMinutes() + " ";
    date += dateString.getUTCHours() < 12 ? 'AM': 'PM';

    return date;
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
