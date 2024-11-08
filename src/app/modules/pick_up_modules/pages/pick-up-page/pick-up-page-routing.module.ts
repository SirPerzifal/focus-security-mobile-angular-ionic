import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickUpPagePage } from './pick-up-page.page';

const routes: Routes = [
  {
    path: '',
    component: PickUpPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickUpPagePageRoutingModule {}
