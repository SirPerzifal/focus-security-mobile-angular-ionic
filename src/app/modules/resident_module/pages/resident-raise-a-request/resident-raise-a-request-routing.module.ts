import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentRaiseARequestPage } from './resident-raise-a-request.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentRaiseARequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentRaiseARequestPageRoutingModule {}
