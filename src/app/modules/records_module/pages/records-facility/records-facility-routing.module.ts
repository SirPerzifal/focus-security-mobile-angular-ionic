import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsFacilityPage } from './records-facility.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsFacilityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsFacilityPageRoutingModule {}
