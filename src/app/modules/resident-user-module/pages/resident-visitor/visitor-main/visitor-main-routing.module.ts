import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitorMainPage } from './visitor-main.page';

const routes: Routes = [
  {
    path: '',
    component: VisitorMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitorMainPageRoutingModule {}
