import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children:
      [
        {
          path: 'vehicle-list',
          children:
            [
              {
                path: '',
                loadChildren: '../vehicle-list/vehicle-list.module#VehicleListPageModule'
              }
            ]
        },
        {
          path: 'vehicle-map',
          children:
            [
              {
                path: '',
                loadChildren: '../vehicle-map/vehicle-map.module#VehicleMapPageModule'
              }
            ]
        },
        {
          path: 'vehicle-map/:VehicleNumbers',
          children:
            [
              {
                path: '',
                loadChildren: '../vehicle-map/vehicle-map.module#VehicleMapPageModule'
              }
            ]
        }
      ]
  },
  {
    path: '',
    redirectTo: 'tabs/vehicle-list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports:[
      RouterModule.forChild(routes)
    ],
  exports:[ RouterModule ]
})
export class TabsPageRoutingModule { }