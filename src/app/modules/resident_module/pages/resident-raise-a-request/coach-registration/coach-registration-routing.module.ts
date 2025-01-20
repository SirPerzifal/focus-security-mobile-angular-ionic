import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoachRegistrationPage } from './coach-registration.page';

const routes: Routes = [
  {
    path: '',
    component: CoachRegistrationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoachRegistrationPageRoutingModule {}
