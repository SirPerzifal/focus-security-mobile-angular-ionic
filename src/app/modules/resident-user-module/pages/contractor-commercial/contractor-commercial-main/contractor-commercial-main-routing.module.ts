import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractorCommercialMainPage } from './contractor-commercial-main.page';

const routes: Routes = [
  {
    path: '',
    component: ContractorCommercialMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractorCommercialMainPageRoutingModule {}
