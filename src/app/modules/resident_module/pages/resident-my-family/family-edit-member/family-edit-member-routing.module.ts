import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamilyEditMemberPage } from './family-edit-member.page';

const routes: Routes = [
  {
    path: '',
    component: FamilyEditMemberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamilyEditMemberPageRoutingModule {}
