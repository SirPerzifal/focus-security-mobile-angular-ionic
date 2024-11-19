import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentPaymentPage } from './resident-payment.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentPaymentPageRoutingModule {}
