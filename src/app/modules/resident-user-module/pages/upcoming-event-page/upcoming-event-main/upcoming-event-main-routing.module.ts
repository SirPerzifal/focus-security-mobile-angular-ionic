import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpcomingEventMainPage } from './upcoming-event-main.page';

const routes: Routes = [
  {
    path: '',
    component: UpcomingEventMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpcomingEventMainPageRoutingModule {}
