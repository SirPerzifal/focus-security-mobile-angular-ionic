import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsWheelClampedPage } from './records-wheel-clamped.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsWheelClampedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsWheelClampedPageRoutingModule {}
