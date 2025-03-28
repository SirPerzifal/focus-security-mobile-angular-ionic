import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyVehiclePaymentFormPage } from './my-vehicle-payment-form.page';

const routes: Routes = [
  {
    path: '',
    component: MyVehiclePaymentFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyVehiclePaymentFormPageRoutingModule {}
