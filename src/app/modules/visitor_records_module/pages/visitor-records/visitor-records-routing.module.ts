import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitorRecordsPage } from './visitor-records.page';

const routes: Routes = [
  {
    path: '',
    component: VisitorRecordsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitorRecordsPageRoutingModule {}
