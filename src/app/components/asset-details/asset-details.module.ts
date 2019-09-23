import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssetDetailsComponent } from './asset-details.component';

@NgModule({
  imports: [ CommonModule, FormsModule,IonicModule,],
  declarations: [AssetDetailsComponent],
  exports: [AssetDetailsComponent]
})
export class AssetDetailsComponentModule {}
