import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientTermsConditionsPage } from './client-terms-conditions.page';

const routes: Routes = [
  {
    path: '',
    component: ClientTermsConditionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientTermsConditionsPageRoutingModule {}
