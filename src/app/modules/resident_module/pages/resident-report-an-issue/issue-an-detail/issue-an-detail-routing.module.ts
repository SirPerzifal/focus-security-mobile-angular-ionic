import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssueAnDetailPage } from './issue-an-detail.page';

const routes: Routes = [
  {
    path: '',
    component: IssueAnDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssueAnDetailPageRoutingModule {}
