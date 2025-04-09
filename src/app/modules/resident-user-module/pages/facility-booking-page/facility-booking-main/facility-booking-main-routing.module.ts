import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityBookingMainPage } from './facility-booking-main.page';

const routes: Routes = [
  {
    path: '',
    component: FacilityBookingMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityBookingMainPageRoutingModule {}
