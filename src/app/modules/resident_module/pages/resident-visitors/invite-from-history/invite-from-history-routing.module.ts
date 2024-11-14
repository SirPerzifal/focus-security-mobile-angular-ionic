import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InviteFromHistoryPage } from './invite-from-history.page';

const routes: Routes = [
  {
    path: '',
    component: InviteFromHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InviteFromHistoryPageRoutingModule {}
