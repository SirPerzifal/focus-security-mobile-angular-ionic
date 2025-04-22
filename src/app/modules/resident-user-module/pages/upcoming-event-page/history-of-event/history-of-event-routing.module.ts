import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryOfEventPage } from './history-of-event.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryOfEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryOfEventPageRoutingModule {}
