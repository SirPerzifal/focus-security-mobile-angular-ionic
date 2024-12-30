import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentPollingPage } from './resident-polling.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentPollingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentPollingPageRoutingModule {}
