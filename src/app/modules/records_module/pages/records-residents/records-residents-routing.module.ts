import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsResidentsPage } from './records-residents.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsResidentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsResidentsPageRoutingModule {}
