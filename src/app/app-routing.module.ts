import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'tabs', canActivate: [ AuthGuard ], loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'add-asset', canActivate: [ AuthGuard ], loadChildren: './pages/add-asset/add-asset.module#AddAssetPageModule' },
  { path: 'my-profile', canActivate: [ AuthGuard ], loadChildren: './pages/my-profile/my-profile.module#MyProfilePageModule' },  
  { path: 'contact-us', canActivate: [ AuthGuard ], loadChildren: './pages/contact-us/contact-us.module#ContactUsPageModule' },
  { path: 'fuel-report', canActivate: [ AuthGuard ], loadChildren: './pages/fuel-report/fuel-report.module#FuelReportPageModule' },
  { path: 'speed-report', canActivate: [ AuthGuard ], loadChildren: './pages/speed-report/speed-report.module#SpeedReportPageModule' },
  { path: 'distance-report', canActivate: [ AuthGuard ], loadChildren: './pages/distance-report/distance-report.module#DistanceReportPageModule' },
  { path: 'travel-replay', canActivate: [ AuthGuard ], loadChildren: './pages/travel-replay/travel-replay.module#TravelReplayPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
