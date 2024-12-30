import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsVisitorDetailPage } from './records-visitor-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsVisitorDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsVisitorDetailPageRoutingModule {}
