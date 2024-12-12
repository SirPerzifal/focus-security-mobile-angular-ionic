import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleRecordsPagePage } from './vehicle-records-page.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleRecordsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleRecordsPagePageRoutingModule {}
