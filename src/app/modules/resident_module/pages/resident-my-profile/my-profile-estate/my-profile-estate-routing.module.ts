import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProfileEstatePage } from './my-profile-estate.page';

const routes: Routes = [
  {
    path: '',
    component: MyProfileEstatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfileEstatePageRoutingModule {}
