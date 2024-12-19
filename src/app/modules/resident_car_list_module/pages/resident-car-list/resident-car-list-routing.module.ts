import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentCarListPage } from './resident-car-list.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentCarListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentCarListPageRoutingModule {}
