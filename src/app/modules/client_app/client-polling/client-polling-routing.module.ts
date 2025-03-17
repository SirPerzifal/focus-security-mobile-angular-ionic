import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientPollingPage } from './client-polling.page';

const routes: Routes = [
  {
    path: '',
    component: ClientPollingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientPollingPageRoutingModule {}
