import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentCarWarningClampPage } from './resident-car-warning-clamp.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentCarWarningClampPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentCarWarningClampPageRoutingModule {}
