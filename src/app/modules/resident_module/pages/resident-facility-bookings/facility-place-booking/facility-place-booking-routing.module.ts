import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityPlaceBookingPage } from './facility-place-booking.page';

const routes: Routes = [
  {
    path: '',
    component: FacilityPlaceBookingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityPlaceBookingPageRoutingModule {}
