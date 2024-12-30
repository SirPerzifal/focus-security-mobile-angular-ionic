import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OvernightParkingModalPage } from './overnight-parking-modal.page';

const routes: Routes = [
  {
    path: '',
    component: OvernightParkingModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OvernightParkingModalPageRoutingModule {}
