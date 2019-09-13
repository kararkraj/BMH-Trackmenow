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
      url: this.getIconUrl(vehicle.VehicleTypeName) + '-' + this.getIconColor(vehicle) + '-' + this.getMarkerOrigin(vehicle.LatestGPSInfo.Degree) + '.png',
      scaledSize: new google.maps.Size(60, 60),
      anchor: new google.maps.Point(30, 30),
      animation: "DROP"
    };

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

        const icon = {
          url: this.getIconUrl(vehicle.VehicleTypeName) + '-' + this.getIconColor(vehicle) + '-' + this.getMarkerOrigin(vehicle.LatestGPSInfo.Degree) + '.png',
          scaledSize: new google.maps.Size(60, 60),
          anchor: new google.maps.Point(30, 30),
          animation: "DROP"
        };
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
      case 0:
        return new google.maps.Point(0, 0);
      case 1: //BAG
        return new google.maps.Point(20, 40);
      case 2:
        return new google.maps.Point(40, 40);
    }
  }

  getIconRotation(degree) {
    return (Math.round(degree / 10) * 10) === 0 ? 360 : (Math.round(degree / 10) * 10);
  }

  getMarkerOrigin(degree) {
    switch (Math.round(degree / 45)) {
      case 0:
        return 0;
      // return new google.maps.Point(40, 0);
      case 1:
        return 45;
      // return new google.maps.Point(80, 0);
      case 2:
        return 90;
      // return new google.maps.Point(120, 0);
      case 3:
        return 135;
      // return new google.maps.Point(160, 0);
      case 4:
        return 180;
      // return new google.maps.Point(200, 0);
      case 5:
        return 225;
      // return new google.maps.Point(240, 0);
      case 6:
        return 270;
      // return new google.maps.Point(280, 0);
      case 7:
        return 315;
      // return new google.maps.Point(0, 0);
      default:
        return 0;
    }
  }

  getIconUrl(vehicleTypeName) {
    return "./assets/vehicles/" + vehicleTypeName.toLowerCase() + "/" + vehicleTypeName.toLowerCase();
    // switch (vehicleTypeId) {
    //   case 1:
    //     return baseUrl + "truck/truck";
    //   case 2:
    //     return baseUrl + "bus/bus";
    //   case 3:
    //     return baseUrl + "car/car";
    //   case 4:
    //     return baseUrl + "tractor/tractor";
    //   case 5:
    //     return baseUrl + "train/train";
    // }
  }

  getIconColor(vehicle) {
    if (vehicle.LatestGPSInfo.Ignition === "0") {
      return "red";
      // return "r";
    } else if (vehicle.LatestGPSInfo.Speed > 0) {
      return "green";
      // return "g";
    } else {
      return "grey";
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
    setTimeout(() => {
      this.map.fitBounds(mapBounds);
    }, 100)
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

  resetMap() {
    this.map = null;
    this.markers = [];
    this.selectedVehicleMarker = null;
    this.isVehicleBeingTracked = false;
  }

}
