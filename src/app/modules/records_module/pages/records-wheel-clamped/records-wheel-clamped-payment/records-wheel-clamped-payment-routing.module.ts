import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsWheelClampedPaymentPage } from './records-wheel-clamped-payment.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsWheelClampedPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsWheelClampedPaymentPageRoutingModule {}
