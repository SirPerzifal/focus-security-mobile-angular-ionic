import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RaiseARequestHistoryPage } from './raise-a-request-history.page';

const routes: Routes = [
  {
    path: '',
    component: RaiseARequestHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaiseARequestHistoryPageRoutingModule {}
