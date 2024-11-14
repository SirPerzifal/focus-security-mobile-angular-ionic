import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentVisitorsPage } from './resident-visitors.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentVisitorsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentVisitorsPageRoutingModule {}
