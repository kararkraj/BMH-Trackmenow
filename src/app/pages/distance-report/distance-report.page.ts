import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AssetService } from './../../services/asset/asset.service';
import { HttpService } from './../../services/http/http.service';
import { ToastService } from './../../services/toast/toast.service';
import { LoaderService } from './../../services/loader/loader.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-distance-report',
  templateUrl: './distance-report.page.html',
  styleUrls: ['./distance-report.page.scss'],
})
export class DistanceReportPage implements OnInit {

  public asset = "Vehicle";
  public assetNumbers = [];
  public distanceReport = [];

  public distanceReportForm = new FormGroup({
    "VehicleNumber": new FormControl('', Validators.required),
    "Start": new FormControl('', Validators.required),
    "End": new FormControl('', Validators.required)
  });

  constructor(
    private assetService: AssetService,
    private http: HttpService,
    private toast: ToastService,
    private loader: LoaderService
  ) { }

  ngOnInit() {
    this.getAssetNumbers();
  }

  getAssetNumbers() {
    this.assetNumbers = this.assetService.getAssetNumbers();
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
        this.http.getDistanceReport(this.distanceReportForm).subscribe((res: []) => {
          this.loader.stopLoading();
          this.distanceReport = res;
        }, (error) => {
          this.toast.toastHandler(environment.messages.somethingWrong, "secondary");
          this.loader.stopLoading();
        });
      }
    });
  };

}
