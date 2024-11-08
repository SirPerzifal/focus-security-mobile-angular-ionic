import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractorFormPage } from './contractor-form.page';

const routes: Routes = [
  {
    path: '',
    component: ContractorFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractorFormPageRoutingModule {}
