import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractorInvitingFormPage } from './contractor-inviting-form.page';

const routes: Routes = [
  {
    path: '',
    component: ContractorInvitingFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractorInvitingFormPageRoutingModule {}
