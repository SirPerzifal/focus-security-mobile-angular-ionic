import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyVehicleDetailPage } from './my-vehicle-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MyVehicleDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyVehicleDetailPageRoutingModule {}
