import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OvernightParkingDetailPage } from './overnight-parking-detail.page';

const routes: Routes = [
  {
    path: '',
    component: OvernightParkingDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OvernightParkingDetailPageRoutingModule {}
