import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VmsCheckoutPage } from './vms-checkout.page';

const routes: Routes = [
  {
    path: '',
    component: VmsCheckoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VmsCheckoutPageRoutingModule {}
