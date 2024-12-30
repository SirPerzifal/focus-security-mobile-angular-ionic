import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsFacilityDetailPage } from './records-facility-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsFacilityDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsFacilityDetailPageRoutingModule {}
