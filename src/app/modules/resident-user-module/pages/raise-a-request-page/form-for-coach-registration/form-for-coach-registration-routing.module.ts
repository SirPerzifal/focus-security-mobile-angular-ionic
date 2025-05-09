import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormForCoachRegistrationPage } from './form-for-coach-registration.page';

const routes: Routes = [
  {
    path: '',
    component: FormForCoachRegistrationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormForCoachRegistrationPageRoutingModule {}
