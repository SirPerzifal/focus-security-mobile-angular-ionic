import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailHistoryInVisitorPage } from './detail-history-in-visitor.page';

const routes: Routes = [
  {
    path: '',
    component: DetailHistoryInVisitorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailHistoryInVisitorPageRoutingModule {}
