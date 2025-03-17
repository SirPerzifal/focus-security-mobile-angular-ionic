import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractorNricScanPage } from './contractor-nric-scan.page';

const routes: Routes = [
  {
    path: '',
    component: ContractorNricScanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractorNricScanPageRoutingModule {}
