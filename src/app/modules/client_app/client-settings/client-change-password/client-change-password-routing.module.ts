import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientChangePasswordPage } from './client-change-password.page';

const routes: Routes = [
  {
    path: '',
    component: ClientChangePasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientChangePasswordPageRoutingModule {}
