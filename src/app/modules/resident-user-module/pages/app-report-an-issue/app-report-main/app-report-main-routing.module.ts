import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppReportMainPage } from './app-report-main.page';

const routes: Routes = [
  {
    path: '',
    component: AppReportMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppReportMainPageRoutingModule {}
