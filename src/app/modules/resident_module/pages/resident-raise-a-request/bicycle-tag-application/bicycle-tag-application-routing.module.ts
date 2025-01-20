import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BicycleTagApplicationPage } from './bicycle-tag-application.page';

const routes: Routes = [
  {
    path: '',
    component: BicycleTagApplicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BicycleTagApplicationPageRoutingModule {}
