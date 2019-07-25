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
    // const icon = {
    //   url: './assets/img/car.png',
    //   // url: 'https://www.trackmenow.co/Content/Images/Vehicles/car.png',
    //   size: new google.maps.Size(40, 40),
    //   origin: this.getMarkerOrigin(vehicle.LatestGPSInfo.Degree),
    //   anchor: this.getMarkerAchor(0),
    //   animation: "DROP"
    // };
    const icon = {
      anchor: this.getMarkerAchor(2),
      // path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 2,
      fillColor: "red",
      fillOpacity: 0.8,
      strokeWeight: 0,
      rotation: vehicle.LatestGPSInfo.Degree
    }
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

}
