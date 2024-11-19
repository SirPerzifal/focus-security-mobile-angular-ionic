import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillsHistoryPage } from './bills-history.page';

const routes: Routes = [
  {
    path: '',
    component: BillsHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillsHistoryPageRoutingModule {}
