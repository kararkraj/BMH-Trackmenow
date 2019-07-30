import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
const routes: Routes = [
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'add-vehicle', loadChildren: './pages/add-vehicle/add-vehicle.module#AddVehiclePageModule' },
  { path: 'my-profile', loadChildren: './pages/my-profile/my-profile.module#MyProfilePageModule' },  
  { path: 'contact-us', loadChildren: './pages/contact-us/contact-us.module#ContactUsPageModule' },
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }