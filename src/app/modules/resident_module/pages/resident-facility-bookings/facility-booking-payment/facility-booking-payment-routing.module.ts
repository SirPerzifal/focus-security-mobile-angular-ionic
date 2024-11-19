import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityBookingPaymentPage } from './facility-booking-payment.page';

const routes: Routes = [
  {
    path: '',
    component: FacilityBookingPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityBookingPaymentPageRoutingModule {}
