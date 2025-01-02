import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentHomepagePage } from './resident-homepage.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentHomepagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentHomepagePageRoutingModule {}
