import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractorInvitingFromHistoryPage } from './contractor-inviting-from-history.page';

const routes: Routes = [
  {
    path: '',
    component: ContractorInvitingFromHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractorInvitingFromHistoryPageRoutingModule {}
