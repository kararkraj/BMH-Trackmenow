import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { environment } from './../../../../environments/environment';

import { Vehicle } from './vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private useMockServer: boolean = false;
  private baseMockURL: string = "https://ac0e0dc5-440a-4225-95f1-d37157a5d041.mock.pstmn.io/api";

  private headers: HttpHeaders;

  private vehicles: Vehicle[];
  public isVehiclesPopulated = new BehaviorSubject(false);
  private selectedVehicleNumbers = [];
  private filterString: string = "";

  constructor(
    private http: HttpClient,
    private storage: Storage,
  ) {
    this.setHeaders().then(() => {
      this.getVehicles().subscribe((vehicles: Vehicle[]) => {
        console.log("subscribe");
        this.vehicles = vehicles;
        this.setAllVehiclesVisible();
        this.isVehiclesPopulated.next(true);
      });
      setInterval(() => {
        this.getVehicles().subscribe((vehicles: Vehicle[]) => {
          vehicles.forEach((vehicle: Vehicle) => {
            if (this.selectedVehicleNumbers.includes(vehicle.VehicleNumber)) {
              vehicle.Selected = true;
            }
            if (vehicle.VehicleNumber.toLowerCase().includes(this.filterString)) {
              vehicle.Visible = true;
            }
          });
          this.vehicles = vehicles;
          console.log("Vehicles updated.");
          this.isVehiclesPopulated.next(true);
        });
      }, 20000);
    });
  }

  async setHeaders() {
    return await this.storage.get(environment.apis.authToken).then((authToken) => {
      this.headers = new HttpHeaders({
        AuthorizeToken: authToken
      });
    });
  }

  getVehicles() {
    return this.http.get((this.useMockServer ? this.baseMockURL : environment.apis.baseApiUrl) + environment.apis.getVehicles, {
      headers: this.headers
    });
  }

  selectVehicle(vehicleNumber) {
    this.vehicles.forEach((vehicle) => {
      if (vehicle.VehicleNumber === vehicleNumber) {
        vehicle.Selected = true;
      }
    });
  }

  deselectVehicle(vehicleNumber) {
    this.vehicles.forEach((vehicle) => {
      if (vehicle.VehicleNumber === vehicleNumber) {
        vehicle.Selected = false;
      }
    });
  }

  deselectAllVehicles() {
    this.vehicles.forEach((vehicle) => {
      if (vehicle.Selected) {
        vehicle.Selected = false;
      }
    });
  }

  populateVehicles() {
    return this.vehicles;
  }

  toggleVehicleNumberSelection(vehicleNumber) {
    if (this.selectedVehicleNumbers.includes(vehicleNumber)) {
      this.deselectVehicleNumber(vehicleNumber);
    } else {
      this.selectVehicleNumber(vehicleNumber);
    }
  }

  selectVehicleNumber(vehicleNumber) {
    this.selectedVehicleNumbers.push(vehicleNumber);
    this.selectVehicle(vehicleNumber);
  }

  deselectVehicleNumber(vehicleNumber) {
    const index = this.selectedVehicleNumbers.findIndex(vehiclenumber => vehiclenumber === vehicleNumber);
    this.selectedVehicleNumbers.splice(index, 1);
    this.deselectVehicle(vehicleNumber);
  }

  clearSelectedVehicleNumbers() {
    this.selectedVehicleNumbers.splice(0, this.selectedVehicleNumbers.length);
    this.deselectAllVehicles();
  }

  getSelectedVehicleNumbers() {
    return this.selectedVehicleNumbers;
  }

  setAllVehiclesVisible() {
    this.vehicles.forEach((vehicle) => {
      if (!vehicle.Visible) {
        vehicle.Visible = true;
      }
    });
  }

  filterVehicles(filterString) {
    this.setFilterString(filterString);
    this.vehicles.forEach((vehicle) => {
      if (vehicle.VehicleNumber.toLowerCase().includes(this.filterString)) {
        vehicle.Visible = true;
      } else { 
        vehicle.Visible = false;
      }
    });
  }

  setFilterString(filterString) {
    this.filterString = filterString.toLowerCase();
  }

  resetFilterString() {
    this.filterString = "";
  }

  getVehicle(vehicleNumber): Vehicle {
    return this.vehicles.find((vehicle: Vehicle) => {
      return (vehicle.VehicleNumber === vehicleNumber);
    });
  }
}
