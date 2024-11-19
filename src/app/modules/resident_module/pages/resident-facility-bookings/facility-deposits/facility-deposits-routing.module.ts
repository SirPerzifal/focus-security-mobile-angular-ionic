import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityDepositsPage } from './facility-deposits.page';

const routes: Routes = [
  {
    path: '',
    component: FacilityDepositsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityDepositsPageRoutingModule {}
