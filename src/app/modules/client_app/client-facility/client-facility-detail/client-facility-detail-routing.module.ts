import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientFacilityDetailPage } from './client-facility-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ClientFacilityDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientFacilityDetailPageRoutingModule {}
