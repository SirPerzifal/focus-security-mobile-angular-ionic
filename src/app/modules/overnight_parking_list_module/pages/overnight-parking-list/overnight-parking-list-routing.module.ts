import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OvernightParkingListPage } from './overnight-parking-list.page';

const routes: Routes = [
  {
    path: '',
    component: OvernightParkingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OvernightParkingListPageRoutingModule {}
