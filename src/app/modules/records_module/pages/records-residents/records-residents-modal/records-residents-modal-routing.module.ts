import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsResidentsModalPage } from './records-residents-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsResidentsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsResidentsModalPageRoutingModule {}
