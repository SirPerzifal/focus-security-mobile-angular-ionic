import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientMainAppPage } from './client-main-app.page';

const routes: Routes = [
  {
    path: '',
    component: ClientMainAppPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientMainAppPageRoutingModule {}
