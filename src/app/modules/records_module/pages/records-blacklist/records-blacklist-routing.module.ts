import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsBlacklistPage } from './records-blacklist.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsBlacklistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsBlacklistPageRoutingModule {}
