import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentMyProfilePage } from './resident-my-profile.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentMyProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentMyProfilePageRoutingModule {}
