import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageNewCardPage } from './manage-new-card.page';

const routes: Routes = [
  {
    path: '',
    component: ManageNewCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageNewCardPageRoutingModule {}
