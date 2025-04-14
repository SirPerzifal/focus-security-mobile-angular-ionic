import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractorCommercialFormPage } from './contractor-commercial-form.page';

const routes: Routes = [
  {
    path: '',
    component: ContractorCommercialFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractorCommercialFormPageRoutingModule {}
