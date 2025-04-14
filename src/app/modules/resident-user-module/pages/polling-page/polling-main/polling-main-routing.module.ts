import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PollingMainPage } from './polling-main.page';

const routes: Routes = [
  {
    path: '',
    component: PollingMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PollingMainPageRoutingModule {}
