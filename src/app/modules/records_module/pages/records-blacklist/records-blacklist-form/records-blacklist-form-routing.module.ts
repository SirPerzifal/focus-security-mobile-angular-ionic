import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordsBlacklistFormPage } from './records-blacklist-form.page';

const routes: Routes = [
  {
    path: '',
    component: RecordsBlacklistFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsBlacklistFormPageRoutingModule {}
