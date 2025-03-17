import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientLoginPage } from './client-login.page';

const routes: Routes = [
  {
    path: '',
    component: ClientLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientLoginPageRoutingModule {}
