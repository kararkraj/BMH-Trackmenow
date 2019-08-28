import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VehicleService } from './../../services/vehicle/vehicle.service';
import { HttpService } from './../../services/http/http.service';
import { ToastService } from './../../../public/services/toast/toast.service';
import { LoaderService } from './../../../public/services/loader/loader.service';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-distance-report',
  templateUrl: './distance-report.page.html',
  styleUrls: ['./distance-report.page.scss'],
})
export class DistanceReportPage implements OnInit {

  public vehicleNumbers = [];
  public distanceReport = [];

  public distanceReportForm = new FormGroup({
    "VehicleNumber": new FormControl('', Validators.required),
    "Start": new FormControl('', Validators.required),
    "End": new FormControl('', Validators.required)
  });

  constructor(
    private vehicleService: VehicleService,
    private http: HttpService,
    private toast: ToastService,
    private loader: LoaderService
  ) { }

  ngOnInit() {
    this.getVehicleNumbers();
  }

  getVehicleNumbers() {
    this.vehicleNumbers = this.vehicleService.getVehicleNumbers();
  }

  reset() {
    this.distanceReportForm.reset();
  }

  getDistanceReport() {
    this.loader.startLoading().then(() => {
      let data = {
        "VehicleNumber": this.distanceReportForm.value.VehicleNumber,
        "Start": this.distanceReportForm.value.Start.split(".")[0] + "Z",
        "End": this.distanceReportForm.value.End.split(".")[0] + "Z"
      }
      if (data.Start === "Z" || data.End === "Z") {
        this.toast.toastHandler("Please select the date range", "secondary");
        this.loader.stopLoading();
      } else {
        this.http.getDistanceReport(this.distanceReportForm.value).then((subscription) => {
          subscription.subscribe((res: []) => {
            this.loader.stopLoading();
            this.distanceReport = res;
          }, (error) => {
            this.toast.toastHandler(environment.messages.somethingWrong, "secondary");
            this.loader.stopLoading();
          });
        });
      }
    });
  };

}
