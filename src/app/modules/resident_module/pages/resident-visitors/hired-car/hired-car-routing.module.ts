import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HiredCarPage } from './hired-car.page';

const routes: Routes = [
  {
    path: '',
    component: HiredCarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HiredCarPageRoutingModule {}
