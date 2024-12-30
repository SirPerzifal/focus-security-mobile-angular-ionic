import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClosedPollingPage } from './closed-polling.page';

const routes: Routes = [
  {
    path: '',
    component: ClosedPollingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClosedPollingPageRoutingModule {}
