import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoveInOutPermitPage } from './move-in-out-permit.page';

const routes: Routes = [
  {
    path: '',
    component: MoveInOutPermitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoveInOutPermitPageRoutingModule {}
