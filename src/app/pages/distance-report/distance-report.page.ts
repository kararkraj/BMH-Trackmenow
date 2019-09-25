import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AssetService } from './../../services/asset/asset.service';
import { HttpService } from './../../services/http/http.service';
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
    "AssetNumber": new FormControl('', Validators.required),
    "Start": new FormControl('', Validators.required),
    "End": new FormControl('', Validators.required)
  });

  constructor(
    private assetService: AssetService,
    private http: HttpService
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
    this.http.startLoading().then(() => {
      let data = {
        "VehicleNumber": this.distanceReportForm.value.AssetNumber,
        "Start": this.distanceReportForm.value.Start.split(".")[0] + "Z",
        "End": this.distanceReportForm.value.End.split(".")[0] + "Z"
      }
      if (data.Start === "Z" || data.End === "Z") {
        this.http.toastHandler("Please select the date range", "secondary");
        this.http.stopLoading();
      } else {
        this.http.getDistanceReport(data).subscribe((res: []) => {
          this.http.stopLoading();
          this.distanceReport = res;
        }, (error) => {
          console.log(error);
          this.http.toastHandler(environment.messages.somethingWrong, "secondary");
          this.http.stopLoading();
        });
      }
    });
  };

}
