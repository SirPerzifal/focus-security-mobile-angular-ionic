import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterCommercialPage } from './register-commercial.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterCommercialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterCommercialPageRoutingModule {}
