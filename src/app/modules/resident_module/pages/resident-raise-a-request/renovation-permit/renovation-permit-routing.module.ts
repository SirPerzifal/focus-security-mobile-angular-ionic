import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenovationPermitPage } from './renovation-permit.page';

const routes: Routes = [
  {
    path: '',
    component: RenovationPermitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenovationPermitPageRoutingModule {}
