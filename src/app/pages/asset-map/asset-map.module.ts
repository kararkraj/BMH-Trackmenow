import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { AssetMapPage } from './asset-map.page';
import { AssetDetailsComponentModule } from './../../components/asset-details/asset-details.module';
import { AssetDetailsComponent } from './../../components/asset-details/asset-details.component';

const routes: Routes = [
  {
    path: '',
    component: AssetMapPage
  }
];

@NgModule({
  entryComponents: [AssetDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AssetDetailsComponentModule
  ],
  declarations: [AssetMapPage],

})
export class AssetMapPageModule {}
