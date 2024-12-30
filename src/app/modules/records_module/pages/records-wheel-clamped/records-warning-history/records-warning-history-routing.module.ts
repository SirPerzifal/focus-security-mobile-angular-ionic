import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsWarningHistoryPage } from './records-warning-history.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsWarningHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsWarningHistoryPageRoutingModule {}
