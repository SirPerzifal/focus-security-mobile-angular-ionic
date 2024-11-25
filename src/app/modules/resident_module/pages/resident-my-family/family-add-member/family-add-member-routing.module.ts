import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamilyAddMemberPage } from './family-add-member.page';

const routes: Routes = [
  {
    path: '',
    component: FamilyAddMemberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamilyAddMemberPageRoutingModule {}
