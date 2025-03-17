import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientEventsDayViewPage } from './client-events-day-view.page';

const routes: Routes = [
  {
    path: '',
    component: ClientEventsDayViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientEventsDayViewPageRoutingModule {}
