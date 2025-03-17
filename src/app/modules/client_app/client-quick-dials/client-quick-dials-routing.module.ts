import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientQuickDialsPage } from './client-quick-dials.page';

const routes: Routes = [
  {
    path: '',
    component: ClientQuickDialsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientQuickDialsPageRoutingModule {}
