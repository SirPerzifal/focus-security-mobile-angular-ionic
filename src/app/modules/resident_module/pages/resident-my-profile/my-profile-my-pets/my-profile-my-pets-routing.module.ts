import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProfileMyPetsPage } from './my-profile-my-pets.page';

const routes: Routes = [
  {
    path: '',
    component: MyProfileMyPetsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfileMyPetsPageRoutingModule {}
