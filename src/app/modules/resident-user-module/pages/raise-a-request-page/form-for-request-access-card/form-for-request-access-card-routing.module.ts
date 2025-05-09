import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormForRequestAccessCardPage } from './form-for-request-access-card.page';

const routes: Routes = [
  {
    path: '',
    component: FormForRequestAccessCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormForRequestAccessCardPageRoutingModule {}
