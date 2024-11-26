import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaVisitorListPage } from './ma-visitor-list.page';

const routes: Routes = [
  {
    path: '',
    component: MaVisitorListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaVisitorListPageRoutingModule {}
