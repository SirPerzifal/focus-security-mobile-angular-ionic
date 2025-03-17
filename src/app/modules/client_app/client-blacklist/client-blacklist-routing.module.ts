import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientBlacklistPage } from './client-blacklist.page';

const routes: Routes = [
  {
    path: '',
    component: ClientBlacklistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientBlacklistPageRoutingModule {}
