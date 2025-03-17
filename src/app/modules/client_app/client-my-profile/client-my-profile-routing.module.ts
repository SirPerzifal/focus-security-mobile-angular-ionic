import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientMyProfilePage } from './client-my-profile.page';

const routes: Routes = [
  {
    path: '',
    component: ClientMyProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientMyProfilePageRoutingModule {}
