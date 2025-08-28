import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VmsIntercomPage } from './vms-intercom.page';

const routes: Routes = [
  {
    path: '',
    component: VmsIntercomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VmsIntercomPageRoutingModule {}
