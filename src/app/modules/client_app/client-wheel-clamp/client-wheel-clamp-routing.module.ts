import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientWheelClampPage } from './client-wheel-clamp.page';

const routes: Routes = [
  {
    path: '',
    component: ClientWheelClampPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientWheelClampPageRoutingModule {}
