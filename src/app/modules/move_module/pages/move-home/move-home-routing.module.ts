import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoveHomePage } from './move-home.page';

const routes: Routes = [
  {
    path: '',
    component: MoveHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoveHomePageRoutingModule {}
