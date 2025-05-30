import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentDoorAccessPage } from './resident-door-access.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentDoorAccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentDoorAccessPageRoutingModule {}
