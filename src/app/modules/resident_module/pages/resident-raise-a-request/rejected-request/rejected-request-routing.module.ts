import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RejectedRequestPage } from './rejected-request.page';

const routes: Routes = [
  {
    path: '',
    component: RejectedRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RejectedRequestPageRoutingModule {}
