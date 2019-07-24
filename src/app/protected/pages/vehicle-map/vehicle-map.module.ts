import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { VehicleMapPage } from './vehicle-map.page';
import { VehicleDetailsComponentModule } from './../../components/vehicle-details/vehicle-details.module';
import { VehicleDetailsComponent } from './../../components/vehicle-details/vehicle-details.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleMapPage
  }
];

@NgModule({
  entryComponents: [VehicleDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    VehicleDetailsComponentModule
  ],
  declarations: [VehicleMapPage],

})
export class VehicleMapPageModule {}
