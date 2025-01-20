import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccessCardApplicationPage } from './access-card-application.page';

const routes: Routes = [
  {
    path: '',
    component: AccessCardApplicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessCardApplicationPageRoutingModule {}
