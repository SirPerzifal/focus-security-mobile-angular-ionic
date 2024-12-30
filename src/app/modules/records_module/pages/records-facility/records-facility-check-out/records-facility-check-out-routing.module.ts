import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsFacilityCheckOutPage } from './records-facility-check-out.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsFacilityCheckOutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsFacilityCheckOutPageRoutingModule {}
