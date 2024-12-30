import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentFindAServiceProviderPage } from './resident-find-a-service-provider.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentFindAServiceProviderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentFindAServiceProviderPageRoutingModule {}
