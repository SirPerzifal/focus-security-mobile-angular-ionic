import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientAppIssuesPage } from './client-app-issues.page';

const routes: Routes = [
  {
    path: '',
    component: ClientAppIssuesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientAppIssuesPageRoutingModule {}
