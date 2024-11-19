import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagePaymentMethodPage } from './manage-payment-method.page';

const routes: Routes = [
  {
    path: '',
    component: ManagePaymentMethodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePaymentMethodPageRoutingModule {}
