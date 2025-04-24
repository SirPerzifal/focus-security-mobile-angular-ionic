import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentFormVehiclePage } from './payment-form-vehicle.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentFormVehiclePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentFormVehiclePageRoutingModule {}
