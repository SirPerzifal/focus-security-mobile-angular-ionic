import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientResidentsPage } from './client-residents.page';

const routes: Routes = [
  {
    path: '',
    component: ClientResidentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientResidentsPageRoutingModule {}
