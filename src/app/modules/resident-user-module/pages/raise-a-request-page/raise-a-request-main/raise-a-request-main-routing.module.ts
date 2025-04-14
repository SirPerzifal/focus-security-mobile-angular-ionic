import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RaiseARequestMainPage } from './raise-a-request-main.page';

const routes: Routes = [
  {
    path: '',
    component: RaiseARequestMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaiseARequestMainPageRoutingModule {}
