import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetRegistrationPage } from './pet-registration.page';

const routes: Routes = [
  {
    path: '',
    component: PetRegistrationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetRegistrationPageRoutingModule {}
