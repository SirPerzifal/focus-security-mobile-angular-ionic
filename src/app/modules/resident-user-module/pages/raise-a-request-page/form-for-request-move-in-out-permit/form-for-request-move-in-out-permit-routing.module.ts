import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormForRequestMoveInOutPermitPage } from './form-for-request-move-in-out-permit.page';

const routes: Routes = [
  {
    path: '',
    component: FormForRequestMoveInOutPermitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormForRequestMoveInOutPermitPageRoutingModule {}
