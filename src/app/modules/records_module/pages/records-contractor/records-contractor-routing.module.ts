import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsContractorPage } from './records-contractor.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsContractorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsContractorPageRoutingModule {}
