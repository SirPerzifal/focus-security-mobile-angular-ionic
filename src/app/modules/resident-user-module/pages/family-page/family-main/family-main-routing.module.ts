import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamilyMainPage } from './family-main.page';

const routes: Routes = [
  {
    path: '',
    component: FamilyMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamilyMainPageRoutingModule {}
