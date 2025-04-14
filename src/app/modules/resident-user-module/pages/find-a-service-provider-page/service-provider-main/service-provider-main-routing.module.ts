import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceProviderMainPage } from './service-provider-main.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceProviderMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceProviderMainPageRoutingModule {}
