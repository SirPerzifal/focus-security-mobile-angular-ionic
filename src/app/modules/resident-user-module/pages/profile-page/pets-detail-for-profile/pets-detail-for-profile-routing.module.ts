import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetsDetailForProfilePage } from './pets-detail-for-profile.page';

const routes: Routes = [
  {
    path: '',
    component: PetsDetailForProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetsDetailForProfilePageRoutingModule {}
