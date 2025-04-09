import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HiredCardInVisitorPage } from './hired-card-in-visitor.page';

const routes: Routes = [
  {
    path: '',
    component: HiredCardInVisitorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HiredCardInVisitorPageRoutingModule {}
