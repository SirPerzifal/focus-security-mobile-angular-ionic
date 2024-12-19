import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OvernightParkingFormPage } from './overnight-parking-form.page';

const routes: Routes = [
  {
    path: '',
    component: OvernightParkingFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OvernightParkingFormPageRoutingModule {}
