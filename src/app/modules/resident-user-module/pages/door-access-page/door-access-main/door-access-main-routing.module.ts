import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoorAccessMainPage } from './door-access-main.page';

const routes: Routes = [
  {
    path: '',
    component: DoorAccessMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoorAccessMainPageRoutingModule {}
