import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsWheelClampedDetailPage } from './records-wheel-clamped-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsWheelClampedDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsWheelClampedDetailPageRoutingModule {}
