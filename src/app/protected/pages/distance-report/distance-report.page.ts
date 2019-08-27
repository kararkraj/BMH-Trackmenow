import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VehicleService } from './../../services/vehicle/vehicle.service';
import { HttpService } from './../../services/http/http.service';

@Component({
  selector: 'app-distance-report',
  templateUrl: './distance-report.page.html',
  styleUrls: ['./distance-report.page.scss'],
})
export class DistanceReportPage implements OnInit {

  public vehicleNumbers = [];

  public distanceReportForm = new FormGroup({
    "VehicleNumber": new FormControl('', Validators.required),
  });

  constructor(
    private vehicleService: VehicleService,
    private http: HttpService
  ) { }

  ngOnInit() {
    this.getVehicleNumbers();
  }

  getVehicleNumbers() {
    this.vehicleNumbers = this.vehicleService.getVehicleNumbers();
  }

  reset() {
    this.distanceReportForm.reset();
    this.vehicleNumbers = [];
  }

  getDistanceReport() {
    let data;
    this.http.getDistanceReport(data).then((subscription) => {
      subscription.subscribe((res) => {
        console.log(res);
      });
    })
  };

}
