import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentFacilityBookingsPage } from './resident-facility-bookings.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentFacilityBookingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentFacilityBookingsPageRoutingModule {}
