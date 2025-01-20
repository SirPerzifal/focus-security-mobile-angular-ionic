import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityHistoryFormPage } from './facility-history-form.page';

const routes: Routes = [
  {
    path: '',
    component: FacilityHistoryFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacilityHistoryFormPageRoutingModule {}
