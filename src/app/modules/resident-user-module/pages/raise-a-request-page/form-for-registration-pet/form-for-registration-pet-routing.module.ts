import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormForRegistrationPetPage } from './form-for-registration-pet.page';

const routes: Routes = [
  {
    path: '',
    component: FormForRegistrationPetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormForRegistrationPetPageRoutingModule {}
