import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AssetService } from './../../services/asset/asset.service';
import { HttpService } from './../../services/http/http.service';

import { environment } from './../../../environments/environment';

declare var google;

@Component({
  selector: 'app-fuel-report',
  templateUrl: './fuel-report.page.html',
  styleUrls: ['./fuel-report.page.scss'],
})
export class FuelReportPage implements OnInit {

  public asset = "Vehicle";
  public fuelReportForm = new FormGroup({
    "AssetNumber": new FormControl('', Validators.required),
    "fromDate": new FormControl('', Validators.required),
    "fromTime": new FormControl(''),
    "toDate": new FormControl('', Validators.required),
    "toTime": new FormControl('')
  });
  public assetNumbers: string[];
  private data;
  private chartOptions;
  private chart;

  constructor(
    private assetService: AssetService,
    private http: HttpService
  ) { }

  ngOnInit() {
    this.getAssetNumbers();
    this.configureChartData();
    this.setChartOptions();
    this.drawChart();
  }

  ngOnDestroy() {
    this.reset();
  }

  getAssetNumbers() {
    this.assetNumbers = this.assetService.getAssetNumbers();
  }

  configureChartData() {
    this.data = new google.visualization.DataTable();
    this.data.addColumn('datetime', 'Time');
    this.data.addColumn('number', 'Fuel');
  }

  setChartOptions(date?) {
    this.chartOptions = {
      legend: 'none',
      height: 360,
      hAxis: {
        title: 'Date',
        textStyle: {
          color: '#ffffff'
        },
        titleTextStyle: {
          color: '#ffffff'
        },
        baselineColor: '#77869E'
      },
      vAxis: {
        textStyle: {
          color: '#ffffff'
        },
        baselineColor: '#77869E'
      },
      backgroundColor: { fill: 'transparent' },
      colors: ['#ffffff', '#77869E'],
      crosshair: { trigger: 'both' },
      pointSize: 2
    };
  }

  drawChart() {
    this.chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    this.chart.draw(this.data, this.chartOptions);
  }

  getFuelReport() {
    this.http.startLoading().then(() => {
      let data = {
        "VehicleNumber": this.fuelReportForm.value.VehicleNumber,
        "FromDate": (this.fuelReportForm.value.fromDate.split("T")[0] + "T" + (this.fuelReportForm.value.fromTime ? (this.fuelReportForm.value.fromTime.split("T")[1]).split(":")[0] + ":" + (this.fuelReportForm.value.fromTime.split("T")[1]).split(":")[1] + ":00" : "00:00:00")).split(".")[0] + "Z",
        "ToDate": (this.fuelReportForm.value.toDate.split("T")[0] + "T" + (this.fuelReportForm.value.toTime ? (this.fuelReportForm.value.toTime.split("T")[1]).split(":")[0] + ":" + (this.fuelReportForm.value.toTime.split("T")[1]).split(":")[1] + ":00" : "00:00:00")).split(".")[0] + "Z"
      };
      this.http.getFuelReport(data).subscribe((res) => {
        let rows = [];
          res["FuelData"].forEach((data) => {
            rows.push([new Date(data.ReceivedOn.substring(0, data.ReceivedOn.length - 1)), data.Fuel])
          });
          if (rows.length === 0) {
            this.http.toastHandler(environment.messages.reportDataUnavailable.replace("noun", "fuel"), "secondary")
            this.http.stopLoading();
          } else {
            this.data.addRows(rows);
            this.drawChart();
            this.http.stopLoading();
          }
      }, (error) => {
        this.http.toastHandler(environment.messages.somethingWrong, "secondary");
        this.http.stopLoading();
      });
    });
  }

  reset() {
    this.resetChart();
    this.fuelReportForm.reset();
  }

  resetChart() {
    this.data.removeRows(0, this.data.getNumberOfRows());
    this.chart.draw(this.data, this.chartOptions);
  }

}
