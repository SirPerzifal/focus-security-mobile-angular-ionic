import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientNoticesPage } from './client-notices.page';

const routes: Routes = [
  {
    path: '',
    component: ClientNoticesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientNoticesPageRoutingModule {}
