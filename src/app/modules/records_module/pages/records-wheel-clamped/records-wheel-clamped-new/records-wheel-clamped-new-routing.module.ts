import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsWheelClampedNewPage } from './records-wheel-clamped-new.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsWheelClampedNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsWheelClampedNewPageRoutingModule {}
