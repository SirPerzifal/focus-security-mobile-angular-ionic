import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnregisteredResidentCarPage } from './unregistered-resident-car.page';

const routes: Routes = [
  {
    path: '',
    component: UnregisteredResidentCarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnregisteredResidentCarPageRoutingModule {}
