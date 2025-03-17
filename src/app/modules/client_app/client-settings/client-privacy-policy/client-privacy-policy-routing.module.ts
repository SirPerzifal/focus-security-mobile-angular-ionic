import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientPrivacyPolicyPage } from './client-privacy-policy.page';

const routes: Routes = [
  {
    path: '',
    component: ClientPrivacyPolicyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientPrivacyPolicyPageRoutingModule {}
