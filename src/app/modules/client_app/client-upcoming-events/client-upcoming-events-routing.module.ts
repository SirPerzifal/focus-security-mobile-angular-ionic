import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientUpcomingEventsPage } from './client-upcoming-events.page';

const routes: Routes = [
  {
    path: '',
    component: ClientUpcomingEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientUpcomingEventsPageRoutingModule {}
