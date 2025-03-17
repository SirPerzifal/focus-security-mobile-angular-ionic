import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientFacilityPage } from './client-facility.page';

const routes: Routes = [
  {
    path: '',
    component: ClientFacilityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientFacilityPageRoutingModule {}
