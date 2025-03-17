import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientFacilityBookingDetailPage } from './client-facility-booking-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ClientFacilityBookingDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientFacilityBookingDetailPageRoutingModule {}
