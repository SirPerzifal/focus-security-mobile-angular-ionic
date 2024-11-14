import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginEndUserPage } from './login-end-user.page';

const routes: Routes = [
  {
    path: '',
    component: LoginEndUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginEndUserPageRoutingModule {}
