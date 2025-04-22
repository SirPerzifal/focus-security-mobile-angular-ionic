import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityBookingSeeDetailPage } from './facility-booking-see-detail.page';

const routes: Routes = [
  {
    path: '',
    component: FacilityBookingSeeDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityBookingSeeDetailPageRoutingModule {}
