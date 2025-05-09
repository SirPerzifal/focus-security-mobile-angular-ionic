import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormAndHistoryAppealParkingFinesPage } from './form-and-history-appeal-parking-fines.page';

const routes: Routes = [
  {
    path: '',
    component: FormAndHistoryAppealParkingFinesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormAndHistoryAppealParkingFinesPageRoutingModule {}
