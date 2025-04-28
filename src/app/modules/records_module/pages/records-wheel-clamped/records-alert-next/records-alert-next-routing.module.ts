import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsAlertNextPage } from './records-alert-next.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsAlertNextPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsAlertNextPageRoutingModule {}
