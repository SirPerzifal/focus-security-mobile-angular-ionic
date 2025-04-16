import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailHistoryInCommercialPage } from './detail-history-in-commercial.page';

const routes: Routes = [
  {
    path: '',
    component: DetailHistoryInCommercialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailHistoryInCommercialPageRoutingModule {}
