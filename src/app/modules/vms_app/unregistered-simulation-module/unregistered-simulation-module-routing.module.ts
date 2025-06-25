import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnregisteredSimulationModulePage } from './unregistered-simulation-module.page';

const routes: Routes = [
  {
    path: '',
    component: UnregisteredSimulationModulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnregisteredSimulationModulePageRoutingModule {}
