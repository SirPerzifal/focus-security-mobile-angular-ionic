import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentHomePagePage } from './resident-home-page.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentHomePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentHomePagePageRoutingModule {}
