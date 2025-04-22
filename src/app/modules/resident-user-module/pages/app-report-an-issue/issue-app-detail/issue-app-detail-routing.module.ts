import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssueAppDetailPage } from './issue-app-detail.page';

const routes: Routes = [
  {
    path: '',
    component: IssueAppDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssueAppDetailPageRoutingModule {}
