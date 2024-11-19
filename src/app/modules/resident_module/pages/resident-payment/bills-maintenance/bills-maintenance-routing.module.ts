import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillsMaintenancePage } from './bills-maintenance.page';

const routes: Routes = [
  {
    path: '',
    component: BillsMaintenancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillsMaintenancePageRoutingModule {}
