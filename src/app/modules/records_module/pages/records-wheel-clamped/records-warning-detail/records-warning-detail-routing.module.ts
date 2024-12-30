import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsWarningDetailPage } from './records-warning-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsWarningDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsWarningDetailPageRoutingModule {}
