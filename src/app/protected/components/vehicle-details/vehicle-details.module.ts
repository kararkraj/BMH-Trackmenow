import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehicleDetailsComponent } from './vehicle-details.component';

@NgModule({
  imports: [ CommonModule, FormsModule,IonicModule,],
  declarations: [VehicleDetailsComponent],
  exports: [VehicleDetailsComponent]
})
export class VehicleDetailsComponentModule {}
