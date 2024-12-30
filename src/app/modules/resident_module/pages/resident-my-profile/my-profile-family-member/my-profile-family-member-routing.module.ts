import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProfileFamilyMemberPage } from './my-profile-family-member.page';

const routes: Routes = [
  {
    path: '',
    component: MyProfileFamilyMemberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfileFamilyMemberPageRoutingModule {}
