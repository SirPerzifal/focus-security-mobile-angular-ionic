import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyVehicleFormPage } from './my-vehicle-form.page';

const routes: Routes = [
  {
    path: '',
    component: MyVehicleFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyVehicleFormPageRoutingModule {}
