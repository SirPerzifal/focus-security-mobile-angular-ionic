import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VmsGatePage } from './vms-gate.page';

const routes: Routes = [
  {
    path: '',
    component: VmsGatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VmsGatePageRoutingModule {}
