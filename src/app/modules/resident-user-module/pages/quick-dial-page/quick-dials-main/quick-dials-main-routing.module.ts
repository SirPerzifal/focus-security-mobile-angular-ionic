import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuickDialsMainPage } from './quick-dials-main.page';

const routes: Routes = [
  {
    path: '',
    component: QuickDialsMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickDialsMainPageRoutingModule {}
