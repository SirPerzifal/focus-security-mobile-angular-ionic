import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityProcessToPaymentPage } from './facility-process-to-payment.page';

const routes: Routes = [
  {
    path: '',
    component: FacilityProcessToPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityProcessToPaymentPageRoutingModule {}
