import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientFaqPage } from './client-faq.page';

const routes: Routes = [
  {
    path: '',
    component: ClientFaqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientFaqPageRoutingModule {}
