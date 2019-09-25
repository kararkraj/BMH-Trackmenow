import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:
      [
        {
          path: 'asset-list',
          children:
            [
              {
                path: '',
                loadChildren: '../asset-list/asset-list.module#AssetListPageModule'
              }
            ]
        },
        {
          path: 'asset-map',
          children:
            [
              {
                path: '',
                loadChildren: '../asset-map/asset-map.module#AssetMapPageModule'
              }
            ]
        },
        {
          path: 'asset-map/:assetNumber',
          children:
            [
              {
                path: '',
                loadChildren: '../asset-map/asset-map.module#AssetMapPageModule'
              }
            ]
        },
        {
          path: '',
          redirectTo: '/tabs/asset-list',
          pathMatch: 'full'
        }      
      ]
  }
];

@NgModule({
  imports:[
      RouterModule.forChild(routes)
    ],
  exports:[ RouterModule ]
})
export class TabsPageRoutingModule { }