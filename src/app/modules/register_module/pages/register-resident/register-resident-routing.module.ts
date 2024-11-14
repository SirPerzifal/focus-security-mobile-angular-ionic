import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterResidentPage } from './register-resident.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterResidentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterResidentPageRoutingModule {}
