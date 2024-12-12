import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitorRecordDetailPage } from './visitor-record-detail.page';

const routes: Routes = [
  {
    path: '',
    component: VisitorRecordDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitorRecordDetailPageRoutingModule {}
