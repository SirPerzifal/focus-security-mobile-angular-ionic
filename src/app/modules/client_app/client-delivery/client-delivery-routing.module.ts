import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientDeliveryPage } from './client-delivery.page';

const routes: Routes = [
  {
    path: '',
    component: ClientDeliveryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientDeliveryPageRoutingModule {}
