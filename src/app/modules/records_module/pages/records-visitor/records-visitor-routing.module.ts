import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsVisitorPage } from './records-visitor.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsVisitorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsVisitorPageRoutingModule {}
