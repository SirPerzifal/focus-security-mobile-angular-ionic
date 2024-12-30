import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoveDetailPage } from './move-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MoveDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoveDetailPageRoutingModule {}
