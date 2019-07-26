import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
const routes: Routes = [
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'add-vehicle', loadChildren: './add-vehicle/add-vehicle.module#AddVehiclePageModule' },
  { path: 'my-profile', loadChildren: './my-profile/my-profile.module#MyProfilePageModule' },
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }