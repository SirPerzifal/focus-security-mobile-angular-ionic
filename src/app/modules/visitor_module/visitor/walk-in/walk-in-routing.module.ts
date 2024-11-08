import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalkInPage } from './walk-in.page';

const routes: Routes = [
  {
    path: '',
    component: WalkInPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalkInPageRoutingModule {}
