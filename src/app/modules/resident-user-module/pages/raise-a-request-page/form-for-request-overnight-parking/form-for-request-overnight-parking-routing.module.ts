import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormForRequestOvernightParkingPage } from './form-for-request-overnight-parking.page';

const routes: Routes = [
  {
    path: '',
    component: FormForRequestOvernightParkingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormForRequestOvernightParkingPageRoutingModule {}
