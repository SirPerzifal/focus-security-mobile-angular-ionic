import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsBlacklistDetailPage } from './records-blacklist-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsBlacklistDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsBlacklistDetailPageRoutingModule {}
