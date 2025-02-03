import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientRegisterVisitorPage } from './client-register-visitor.page';

const routes: Routes = [
  {
    path: '',
    component: ClientRegisterVisitorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRegisterVisitorPageRoutingModule {}
