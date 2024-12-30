import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentQuickDialsPage } from './resident-quick-dials.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentQuickDialsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentQuickDialsPageRoutingModule {}
