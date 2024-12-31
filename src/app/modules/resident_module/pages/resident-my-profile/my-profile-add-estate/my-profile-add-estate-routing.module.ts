import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProfileAddEstatePage } from './my-profile-add-estate.page';

const routes: Routes = [
  {
    path: '',
    component: MyProfileAddEstatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfileAddEstatePageRoutingModule {}
