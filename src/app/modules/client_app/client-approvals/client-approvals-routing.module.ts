import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientApprovalsPage } from './client-approvals.page';

const routes: Routes = [
  {
    path: '',
    component: ClientApprovalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientApprovalsPageRoutingModule {}
