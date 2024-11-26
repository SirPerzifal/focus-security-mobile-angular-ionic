import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentMyVehiclePage } from './resident-my-vehicle.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentMyVehiclePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentMyVehiclePageRoutingModule {}
