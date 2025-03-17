import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientEventsDetailPage } from './client-events-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ClientEventsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientEventsDetailPageRoutingModule {}
