import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentReportAnIssuePage } from './resident-report-an-issue.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentReportAnIssuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentReportAnIssuePageRoutingModule {}
