import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyVehicleMainPage } from './my-vehicle-main.page';

const routes: Routes = [
  {
    path: '',
    component: MyVehicleMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyVehicleMainPageRoutingModule {}
