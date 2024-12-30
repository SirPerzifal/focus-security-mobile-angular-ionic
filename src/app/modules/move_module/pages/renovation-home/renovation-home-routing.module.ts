import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenovationHomePage } from './renovation-home.page';

const routes: Routes = [
  {
    path: '',
    component: RenovationHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenovationHomePageRoutingModule {}
