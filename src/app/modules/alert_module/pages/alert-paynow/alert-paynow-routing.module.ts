import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertPaynowPage } from './alert-paynow.page';

const routes: Routes = [
  {
    path: '',
    component: AlertPaynowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertPaynowPageRoutingModule {}
