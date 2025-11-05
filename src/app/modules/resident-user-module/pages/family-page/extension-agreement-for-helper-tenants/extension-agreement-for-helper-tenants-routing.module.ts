import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtensionAgreementForHelperTenantsPage } from './extension-agreement-for-helper-tenants.page';

const routes: Routes = [
  {
    path: '',
    component: ExtensionAgreementForHelperTenantsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtensionAgreementForHelperTenantsPageRoutingModule {}
