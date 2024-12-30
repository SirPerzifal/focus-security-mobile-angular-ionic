import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordAppReportPage } from './record-app-report.page';

const routes: Routes = [
  {
    path: '',
    component: RecordAppReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordAppReportPageRoutingModule {}
