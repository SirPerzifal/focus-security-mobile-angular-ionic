import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryUpcomingEventPage } from './history-upcoming-event.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryUpcomingEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryUpcomingEventPageRoutingModule {}
