import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormForRequestBibycleTagApplicationPage } from './form-for-request-bibycle-tag-application.page';

const routes: Routes = [
  {
    path: '',
    component: FormForRequestBibycleTagApplicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormForRequestBibycleTagApplicationPageRoutingModule {}
