import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private useMockServer: boolean = false;
  private baseMockURL: string = "https://ac0e0dc5-440a-4225-95f1-d37157a5d041.mock.pstmn.io/api";

  private headers: HttpHeaders;

  private vehicles;
  public isVehiclesPopulated = new BehaviorSubject(false);
  private selectedVehicleNumbers = [];
  private filteredVehiclesNumbers = [];

  constructor(
    private http: HttpClient,
    private storage: Storage,
  ) {
    this.setHeaders().then(() => {
      this.getVehicles().subscribe((vehicles) => {
        this.vehicles = vehicles;
        this.setAllVisible();
        console.log("Vehicles updated.");
        this.isVehiclesPopulated.next(true);
      });
      setInterval(() => {
        this.getVehicles().subscribe((vehicles: []) => {
          vehicles.forEach((vehicle) => {
            if (this.selectedVehicleNumbers.includes(vehicle['VehicleNumber'])) {
              vehicle['selected'] = true;
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
        vehicle['selected'] = true;
      }
    });
  }

  deselectVehicle(vehicleNumber) {
    this.vehicles.forEach((vehicle) => {
      if (vehicle.VehicleNumber === vehicleNumber) {
        vehicle['selected'] = false;
      }
    });
  }

  deselectAllVehicles() {
    this.vehicles.forEach((vehicle) => {
      if (vehicle['selected']) {
        vehicle['selected'] = false;
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

  setAllVisible() {
    this.vehicles.forEach((vehicle) => {
      if (!vehicle["visible"]) {
        vehicle["visible"] = true;
      }
    });
  }
}
