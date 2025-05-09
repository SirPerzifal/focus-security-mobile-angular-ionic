import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormForRequestRegistrationPermitPage } from './form-for-request-registration-permit.page';

const routes: Routes = [
  {
    path: '',
    component: FormForRequestRegistrationPermitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormForRequestRegistrationPermitPageRoutingModule {}
