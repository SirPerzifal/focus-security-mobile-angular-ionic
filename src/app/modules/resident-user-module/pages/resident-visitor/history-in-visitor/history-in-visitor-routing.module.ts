import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryInVisitorPage } from './history-in-visitor.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryInVisitorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryInVisitorPageRoutingModule {}
