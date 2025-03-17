import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsContractorDetailPage } from './records-contractor-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsContractorDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsContractorDetailPageRoutingModule {}
