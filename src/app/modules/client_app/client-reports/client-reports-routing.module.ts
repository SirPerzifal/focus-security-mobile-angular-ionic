import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientReportsPage } from './client-reports.page';

const routes: Routes = [
  {
    path: '',
    component: ClientReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientReportsPageRoutingModule {}
