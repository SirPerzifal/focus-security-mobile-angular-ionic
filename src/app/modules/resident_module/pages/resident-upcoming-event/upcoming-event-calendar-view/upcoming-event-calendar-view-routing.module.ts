import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpcomingEventCalendarViewPage } from './upcoming-event-calendar-view.page';

const routes: Routes = [
  {
    path: '',
    component: UpcomingEventCalendarViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpcomingEventCalendarViewPageRoutingModule {}
