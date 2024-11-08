import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginProcessPage } from './login-process.page';

const routes: Routes = [
  {
    path: '',
    component: LoginProcessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginProcessPageRoutingModule {}
