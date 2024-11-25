import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentMyFamilyPage } from './resident-my-family.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentMyFamilyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentMyFamilyPageRoutingModule {}
