import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientDoorAccessPage } from './client-door-access.page';

const routes: Routes = [
  {
    path: '',
    component: ClientDoorAccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientDoorAccessPageRoutingModule {}
