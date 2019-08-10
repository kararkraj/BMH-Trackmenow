import { Injectable } from '@angular/core';
import { VehicleService } from './../vehicle/vehicle.service';
import { ModalController } from '@ionic/angular';
import { VehicleDetailsComponent } from './../../components/vehicle-details/vehicle-details.component';

declare var google;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {

  private map;
  private markers = [];
  private selectedVehicleMarker;
  public isVehicleBeingTracked = false;

  constructor(
    private vehicleService: VehicleService,
    private modalController: ModalController
  ) { }

  async initMap(element) {
    this.map = await new google.maps.Map(element.nativeElement, {
      center: { lat: 19.9409388, lng: 72.82819189999998 },
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  }

  isMapInitialized(): boolean {
    return !(!this.map);
  }

  locateVehicles() {
    this.generateVehicleMarkers();
    this.fitMapBounds();
  }

  generateVehicleMarkers() {
    this.vehicleService.populateVehicles().forEach((vehicle) => {
      this.generateVehicleMarker(vehicle);
    });
  }

  generateVehicleMarker(vehicle) {
    const icon = {
      url: './assets/vehicles/truck.svg',
      // url: './assets/vehicles/truck/' + this.getIconColor(vehicle) + this.getMarkerOrigin(vehicle.LatestGPSInfo.Degree) + ".png#" + vehicle.VehicleNumber,
      // url: './assets/img/car.png',
      size: new google.maps.Size(40, 40),
      anchor: this.getMarkerAchor(0),
      animation: "DROP",
      optimized: false
    };
    // const icon = {
    //   anchor: this.getMarkerAchor(2),
    //   path: "M46,123.3h0.5l0.8-0.8v-2.6v-9.1l-0.8-0.8h-0.4v-0.4l-0.1-0.2v-2v-2.1h0.3l0.8-0.2v-3.5v-3.4v-2.5v-1.5v-0.1 l-0.8-0.8H46V59v-0.2V57h0.4l0.8-0.2V44.6l-0.8-0.9H46v-0.5V43v-4.6l-0.9-1.3l-0.4-0.6l-0.2-0.3h-0.1l-1-0.3l-0.5-0.1H37l0.1-0.9 c-0.2-0.1-0.3-0.3-0.5-0.4c-0.4,0-0.7,0-1.1,0h-2.8V34h2.8l1.6-0.2c0-1.2,0-2.5,0-3.7L36.6,30h5.8h1l0.7-0.7l0.3-0.4v-1.4h0.2 l0.8-0.2v-3v-2.8v-2.1v-1.2v-0.1l-0.8-0.7h-0.2V7.7l1.5-0.9l0.5-0.3l2.1-1.2l-0.1-0.4V4.5h-1.2l-1,0.5l-0.2,0.1l-2.2,0.4l-0.7-0.9 L41,3.2L37.1,2H15.4l-3.9,1.3L9.3,4.6L8.7,5.5L6.5,5.2L6.4,5l-1-0.5H4.2V5l0.1,0.4l2.1,1.2l0.5,0.3l1.5,0.8v9.1l-0.1,0.2v0.4H8 l-0.8,0.7v9.2L8,27.4h0.4V29l0.1-0.2V29l1,1h1h6.1L15.6,30l-0.1,2.8c0,0.2,0,0.5,0,0.7c0.2,0.1,0.5,0.4,0.7,0.4c1,0,1.9,0,2.9,0 c0.3,0,0.6,0.1,0.9,0.2v0.3c-1.1,0-2.2,0.1-3.3,0.1s-1.1,0-1.1,0.9c0,0.1,0,0.3,0,0.4H9.9L9.1,36H8.9l-0.6,0.1L7.7,37l-0.9,1.3v4.6 L6.7,43v0.2v0.3H6.3l-0.8,1v0.1v1.6V49v3.7v4l0.8,0.2h0.4V57v1.8l0.1-0.2v34l-0.1,0.2v0.4H6.3l-0.8,0.8v11l0.8,0.2h0.4v1.8l0.1-0.2 v0.5l-0.1,0.1l0.1,0.1v1.9l-0.1,0.2v0.4H6.3l-0.8,0.8v9.1v2.6l0.8,0.8h0.5v0.1H5.3v1.3h1.5v8.7l0.4,0.5l0.4,0.5l0.2,0.3l2.2,0.5 h32.9l2.2-0.5l0.2-0.3l0.4-0.5l0.4-0.5v-8.5h1.5v-1.3H46L46,123.3L46,123.3z M32.7,28.7h-0.3h-0.1c-6.3,0-12.5-0.1-18.8-0.1h-0.4H13l-0.9,0.1c0,0.9,0,1.8-0.1,2.8v0.7 c0.2,0.1,0.5,0.4,0.7,0.4c1,0,1.9,0,2.9,0c0.3,0,0.6,0.1,0.8,0.2c0.1-1.3,0.4-1.6,1.6-1.6l8.8,0.1c1.6,0,1.7,0,2.1,1.3h2.8l1.5-0.2 v-3.6L32.7,28.7z M15.1,29.9c1.6-0.4,3.3-0.4,4.8,0H15.1z M30.7,29.9h-4.8c0-0.1,0-0.2,0-0.3c1.6,0,3.2,0,4.8,0 C30.7,29.7,30.7,29.9,30.7,29.9L30.7,29.9z M16.4,33.2c-1.1,0-2.2,0.1-3.3,0.1s-1.1,0-1.1,0.9c0,0.2,0,0.3,0,0.5h21.2l0.1-1c-0.2-0.1-0.3-0.3-0.5-0.4 c-0.4,0-0.7,0-1.1,0h-2.8c-0.4,0.4-1,0.6-1.5,0.6c-3.2,0-6.4,0-9.6,0C17.1,33.9,16.6,33.8,16.4,33.2z M28.9,33.3v-0.6c-0.5-1.4-0.5-1.4-2.2-1.4l-9-0.1c-1.2,0-1.5,0.3-1.6,1.7v0.3c0.2,0.5,0.7,0.7,1.3,0.7 c3.2,0,6.5,0,9.8,0C27.9,34,28.5,33.7,28.9,33.3z M25.9,29.9h4.8v-0.5c-1.6,0-3.2,0-4.8,0V29.9z M20,29.9c-1.6-0.4-3.3-0.4-4.8,0H20z M39.1,4.7l0.4-1.3l-3-1.4l-3-1.3l0.7,2.1c-7.6-2.3-15.7-2.4-23.3,0l0.7-2.1L8.7,2L5.7,3.5L6,4.7 C5.6,4.9,5.2,5.1,4.8,5.4v22.4l1,1h33.6l1-1V5.4C40,5.2,39.6,4.9,39.1,4.7z M33.5,0.8L33.5,0.8L33.5,0.8z",
    //   // path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    //   scale: 0.2,
    //   fillColor: this.getIconColor(vehicle),
    //   fillOpacity: 0.8,
    //   strokeWeight: 0.1,
    //   rotation: vehicle.LatestGPSInfo.Degree,
    //   animation: "DROP"
    // }
    const marker = new google.maps.Marker({
      position: { lat: vehicle.LatestGPSInfo.Latitude, lng: vehicle.LatestGPSInfo.Longitude },
      map: this.map,
      icon: icon,
      title: vehicle.VehicleNumber,
      animation: google.maps.Animation.DROP,
      visible: true
    });
    const that = this;
    marker.addListener('click', function (event) {
      that.startTrackingVehicle(this.title);
    });
    this.markers.push(marker);
  }

  updateVehicleMarkers() {
    this.vehicleService.populateVehicles().forEach((vehicle) => {
      this.updateVehicleMarker(vehicle);
    });
  }

  updateVehicleMarker(vehicle) {
    this.markers.forEach((marker) => {
      if (marker.title === vehicle.VehicleNumber) {

        const icon = marker.getIcon();
        icon.rotation = vehicle.LatestGPSInfo.Degree;
        marker.setIcon(icon);

        const latOffset = (vehicle.LatestGPSInfo.Latitude - marker.getPosition().lat()) / 100;
        const lngOffset = (vehicle.LatestGPSInfo.Longitude - marker.getPosition().lng()) / 100;

        let currentLat = marker.getPosition().lat();
        let currentLng = marker.getPosition().lng();
        let count = 0;
        const timer = setInterval(() => {
          count++;
          currentLat = currentLat + latOffset;
          currentLng = currentLng + lngOffset;

          const latlng = new google.maps.LatLng(currentLat, currentLng);
          marker.setPosition(latlng);

          if (count === 100) {
            clearInterval(timer);
          }
        }, 20);
        // marker.setPosition({ lat: vehicle.LatestGPSInfo.Latitude, lng: vehicle.LatestGPSInfo.Longitude });
      }
    });
  }

  getMarkerAchor(vehicleType) {
    switch (vehicleType) {
      case 1: //BAG
        return new google.maps.Point(20, 40);
      case 2:
        return new google.maps.Point(0, 0);
      default:
        return new google.maps.Point(20, 20);
    }
  }

  getMarkerOrigin(degree) {
    switch (Math.round(degree / 45)) {
      case 1:
        return "1";
        // return new google.maps.Point(40, 0);
      case 2:
        return "2";
        // return new google.maps.Point(80, 0);
      case 3:
        return "3";
        // return new google.maps.Point(120, 0);
      case 4:
        return "4";
        // return new google.maps.Point(160, 0);
      case 5:
        return "5";
        // return new google.maps.Point(200, 0);
      case 6:
        return "6";
        // return new google.maps.Point(240, 0);
      case 7:
        return "7";
        // return new google.maps.Point(280, 0);
      default:
        return "1";
        // return new google.maps.Point(0, 0);
    }
  }

  getIconUrl(vehicleTypeId) {
    var baseUrl = "./assets/vehicles/";

    switch (vehicleTypeId) {
      case 2:
        return baseUrl + "bus/";
      case 3:
        return baseUrl + "car/";
      case 4:
        return baseUrl + "tractor/";
      case 5:
        return baseUrl + "train/";
      default:
        return baseUrl + "truck/";
    }
  }

  getIconColor(vehicle) {
    if (vehicle.LatestGPSInfo.Ignition === "0") {
      return "red";
      // return "r";
    } else if (vehicle.LatestGPSInfo.Speed > 0) {
      return "#018637";
      // return "g";
    } else {
      return "#797979";
      // return "b";
    }
  }

  fitMapBounds() {
    const mapBounds = new google.maps.LatLngBounds();
    this.markers.forEach((marker) => {
      if (marker.getVisible()) {
        mapBounds.extend(marker.getPosition());
      }
    });
    this.map.fitBounds(mapBounds);
  }

  setMapZoom(zoom) {
    return new Promise((resolve) => {
      this.map.setZoom(zoom);
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  panMap() {
    return new Promise((resolve) => {
      this.map.panTo(this.selectedVehicleMarker.getPosition());
      setTimeout(() => {
        resolve();
      }, 200);
    });
  }

  panMapToBounds(bounds) {
    return new Promise((resolve) => {
      this.map.panToBounds(bounds);
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  startTrackingVehicle(vehicleNumber) {
    if (this.selectedVehicleMarker) {
      this.stopTrackingVehicle();
    }
    this.selectedVehicleMarker = this.markers.find((marker) => {
      return marker.title == vehicleNumber;
    });
    this.panMap().then(() => {
      this.setMapZoom(15).then(() => {
        this.presentVehicleDetailModal(vehicleNumber);
      });
    });
    this.isVehicleBeingTracked = true;
    google.maps.event.addListener(this.selectedVehicleMarker, 'position_changed', () => {
      this.map.panTo(this.selectedVehicleMarker.getPosition());
    });
  }

  stopTrackingVehicle() {
    if (this.selectedVehicleMarker) {
      this.isVehicleBeingTracked = false;
      google.maps.event.clearListeners(this.selectedVehicleMarker, 'position_changed');
      this.selectedVehicleMarker = null;
    }
  }

  startTrackingVehicles() {
    this.stopTrackingVehicle();
    this.markers.forEach((marker) => {
      if (this.vehicleService.getSelectedVehicleNumbers().includes(marker.title)) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    });
    this.fitMapBounds();
  }

  stopTrackingVehicles() {
    this.vehicleService.clearSelectedVehicleNumbers();
    this.markers.forEach((marker) => {
      if (!marker.getVisible()) {
        marker.setVisible(true);
      }
    });
  }

  async presentVehicleDetailModal(vehicleNumber) {
    const modal = await this.modalController.create({
      component: VehicleDetailsComponent,
      componentProps: {
        'VehicleNumber': vehicleNumber
      },
      animated: true,
      cssClass: 'vehicle-details-modal',
      showBackdrop: false
    });
    return await modal.present();
  }

  dismissVehicleDetailModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  resetMap () {
    this.map = null;
    this.markers = [];
    this.selectedVehicleMarker = null;
    this.isVehicleBeingTracked = false;
  }

}
