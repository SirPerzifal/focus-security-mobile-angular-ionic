import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityNewBookingPage } from './facility-new-booking.page';

const routes: Routes = [
  {
    path: '',
    component: FacilityNewBookingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityNewBookingPageRoutingModule {}
