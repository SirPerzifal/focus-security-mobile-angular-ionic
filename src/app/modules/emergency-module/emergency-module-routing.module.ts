import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmergencyModulePage } from './emergency-module.page';

const routes: Routes = [
  {
    path: '',
    component: EmergencyModulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmergencyModulePageRoutingModule {}
