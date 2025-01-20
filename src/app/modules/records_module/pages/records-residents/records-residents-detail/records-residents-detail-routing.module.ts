import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsResidentsDetailPage } from './records-residents-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsResidentsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsResidentsDetailPageRoutingModule {}
