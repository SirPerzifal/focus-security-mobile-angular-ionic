import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CondoIssueReportMainPage } from './condo-issue-report-main.page';

const routes: Routes = [
  {
    path: '',
    component: CondoIssueReportMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CondoIssueReportMainPageRoutingModule {}
