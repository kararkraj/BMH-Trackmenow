import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VehicleService } from './../../services/vehicle/vehicle.service';
import { HttpService } from './../../services/http/http.service';
import { ToastService } from './../../../public/services/toast/toast.service';
import { LoaderService } from './../../../public/services/loader/loader.service';
import { environment } from './../../../../environments/environment';

declare var google;

@Component({
  selector: 'app-speed-report',
  templateUrl: './speed-report.page.html',
  styleUrls: ['./speed-report.page.scss'],
})
export class SpeedReportPage implements OnInit {

  public speedReportForm = new FormGroup({
    "VehicleNumber": new FormControl('', Validators.required),
    "fromDate": new FormControl('', Validators.required),
    "fromTime": new FormControl(''),
    "toDate": new FormControl('', Validators.required),
    "toTime": new FormControl('')
  });
  public vehicleNumbers: string[];
  private data;
  private chartOptions;
  private chart;

  constructor(
    private vehicleService: VehicleService,
    private http: HttpService,
    private toast: ToastService,
    private loader: LoaderService
  ) { }

  ngOnInit() {
    this.getVehicleNumbers();
    this.configureChartData();
    this.setChartOptions();
    this.drawChart();
  }

  ngOnDestroy() {
    this.reset();
  }

  getVehicleNumbers() {
    this.vehicleNumbers = this.vehicleService.getVehicleNumbers();
  }

  configureChartData() {
    this.data = new google.visualization.DataTable();
    this.data.addColumn('datetime', 'Time');
    this.data.addColumn('number', 'Speed');
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

  getSpeedReport() {
    this.loader.startLoading().then(() => {
      let data = {
        "VehicleNumber": this.speedReportForm.value.VehicleNumber,
        "FromDate": (this.speedReportForm.value.fromDate.split("T")[0] + "T" + (this.speedReportForm.value.fromTime ? (this.speedReportForm.value.fromTime.split("T")[1]).split(":")[0] + ":" + (this.speedReportForm.value.fromTime.split("T")[1]).split(":")[1] + ":00" : "00:00:00")).split(".")[0] + "Z",
        "ToDate": (this.speedReportForm.value.toDate.split("T")[0] + "T" + (this.speedReportForm.value.toTime ? (this.speedReportForm.value.toTime.split("T")[1]).split(":")[0] + ":" + (this.speedReportForm.value.toTime.split("T")[1]).split(":")[1] + ":00" : "00:00:00")).split(".")[0] + "Z"
      };
      this.http.getSpeedReport(data).then((subscription) => {
        subscription.subscribe((data) => {
          let rows = [];
          data["SpeedData"].forEach((data) => {
            rows.push([new Date(data.ReceivedOn.substring(0, data.ReceivedOn.length - 1)), data.Speed])
          });
          if (rows.length === 0) {
            this.loader.stopLoading();
            this.toast.toastHandler(environment.messages.reportDataUnavailable.replace("noun", "fuel"), "secondary")
          } else {
            this.data.addRows(rows);
            this.drawChart();
            this.loader.stopLoading();
          }
        }, (error) => {
          this.toast.toastHandler(environment.messages.somethingWrong, "secondary");
          this.loader.stopLoading();
        });
      });
    });
  }

  reset() {
    this.resetChart();
    this.speedReportForm.reset();
  }

  resetChart() {
    this.data.removeRows(0, this.data.getNumberOfRows());
    this.chart.draw(this.data, this.chartOptions);
  }

}
