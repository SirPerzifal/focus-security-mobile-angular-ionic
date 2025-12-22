import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenancePagePage } from './maintenance-page.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenancePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenancePagePageRoutingModule {}
