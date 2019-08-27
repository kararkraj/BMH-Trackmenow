import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './public/pages/login/login.module#LoginPageModule' },
  { path: 'tabs', canActivate: [ AuthGuard ], loadChildren: './protected/pages/tabs/tabs.module#TabsPageModule' },
  { path: 'add-vehicle', canActivate: [ AuthGuard ], loadChildren: './protected/pages/add-vehicle/add-vehicle.module#AddVehiclePageModule' },
  { path: 'my-profile', canActivate: [ AuthGuard ], loadChildren: './protected/pages/my-profile/my-profile.module#MyProfilePageModule' },  
  { path: 'contact-us', canActivate: [ AuthGuard ], loadChildren: './protected/pages/contact-us/contact-us.module#ContactUsPageModule' },
  { path: 'fuel-report', loadChildren: './protected/pages/fuel-report/fuel-report.module#FuelReportPageModule' },
  { path: 'speed-report', loadChildren: './protected/pages/speed-report/speed-report.module#SpeedReportPageModule' },
  { path: 'distance-report', loadChildren: './protected/pages/distance-report/distance-report.module#DistanceReportPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
