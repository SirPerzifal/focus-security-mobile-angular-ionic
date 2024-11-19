import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageAddPage } from './manage-add.page';

const routes: Routes = [
  {
    path: '',
    component: ManageAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageAddPageRoutingModule {}
