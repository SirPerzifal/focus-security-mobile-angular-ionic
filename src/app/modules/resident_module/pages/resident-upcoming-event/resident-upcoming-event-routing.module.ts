import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentUpcomingEventPage } from './resident-upcoming-event.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentUpcomingEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentUpcomingEventPageRoutingModule {}
