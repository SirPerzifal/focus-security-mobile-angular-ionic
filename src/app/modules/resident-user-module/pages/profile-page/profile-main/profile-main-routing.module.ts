import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileMainPage } from './profile-main.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileMainPageRoutingModule {}
