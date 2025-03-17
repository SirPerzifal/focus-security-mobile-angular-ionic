import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertTicketDetailPage } from './alert-ticket-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AlertTicketDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertTicketDetailPageRoutingModule {}
