import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryInContractorPage } from './history-in-contractor.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryInContractorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryInContractorPageRoutingModule {}
