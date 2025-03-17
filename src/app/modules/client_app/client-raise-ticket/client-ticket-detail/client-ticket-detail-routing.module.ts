import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientTicketDetailPage } from './client-ticket-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ClientTicketDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientTicketDetailPageRoutingModule {}
