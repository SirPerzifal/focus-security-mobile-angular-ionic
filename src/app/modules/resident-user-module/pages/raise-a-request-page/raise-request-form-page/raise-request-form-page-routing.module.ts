import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RaiseRequestFormPagePage } from './raise-request-form-page.page';

const routes: Routes = [
  {
    path: '',
    component: RaiseRequestFormPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaiseRequestFormPagePageRoutingModule {}
