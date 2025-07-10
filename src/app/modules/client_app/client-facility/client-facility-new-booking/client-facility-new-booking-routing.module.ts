import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientFacilityNewBookingPage } from './client-facility-new-booking.page';

const routes: Routes = [
  {
    path: '',
    component: ClientFacilityNewBookingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientFacilityNewBookingPageRoutingModule {}
