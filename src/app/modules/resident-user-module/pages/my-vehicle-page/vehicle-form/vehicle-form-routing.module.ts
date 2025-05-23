import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleFormPage } from './vehicle-form.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleFormPageRoutingModule {}
