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

  private vehicles: Vehicle[];
  public isVehiclesPopulated = new BehaviorSubject(false);
  private selectedVehicleNumbers = [];
  private filterString: string = "";
  private callVehiclesApiInterval;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  updateVehiclesInterval() {
    this.callVehiclesApiInterval = setInterval(() => {
      this.getVehicles();
    }, 20000);
  }

  getVehicles() {
    this.storage.get(environment.apis.authToken).then((authToken) => {
      this.http.get((this.useMockServer ? this.baseMockURL : environment.apis.baseApiUrl) + environment.apis.getVehicles, {
        headers: new HttpHeaders({
          AuthorizeToken: authToken
        })
      }).subscribe((vehicles: Vehicle[]) => {
        vehicles = vehicles.filter((vehicle) => {
          return vehicle.LatestGPSInfo !== null;
        });
        vehicles.forEach((vehicle: Vehicle) => {
          if (this.selectedVehicleNumbers.includes(vehicle.VehicleNumber)) {
            vehicle.Selected = true;
          }
          if (vehicle.VehicleNumber.toLowerCase().includes(this.filterString)) {
            vehicle.Visible = true;
          }
        });
        this.vehicles = vehicles;
        this.isVehiclesPopulated.next(true);
        console.log("Vehicles updated.");
      });
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

  reset() {
    clearInterval(this.callVehiclesApiInterval);
    this.vehicles = null;
    this.isVehiclesPopulated.next(false);
    this.filterString = "";
    this.selectedVehicleNumbers = [];
  }

  getVehicleNumbers() {
    const vehicleNumbers = [];
    this.vehicles.forEach((vehicle) => {
      vehicleNumbers.push(vehicle.VehicleNumber);
    });
    return vehicleNumbers;
  }
}
