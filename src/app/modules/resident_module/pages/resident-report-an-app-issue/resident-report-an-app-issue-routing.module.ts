import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentReportAnAppIssuePage } from './resident-report-an-app-issue.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentReportAnAppIssuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentReportAnAppIssuePageRoutingModule {}
