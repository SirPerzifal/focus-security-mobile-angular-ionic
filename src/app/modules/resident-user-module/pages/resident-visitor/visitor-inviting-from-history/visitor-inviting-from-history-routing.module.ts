import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitorInvitingFromHistoryPage } from './visitor-inviting-from-history.page';

const routes: Routes = [
  {
    path: '',
    component: VisitorInvitingFromHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitorInvitingFromHistoryPageRoutingModule {}
