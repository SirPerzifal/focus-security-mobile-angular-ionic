import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppealParkingFinesPage } from './appeal-parking-fines.page';

const routes: Routes = [
  {
    path: '',
    component: AppealParkingFinesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppealParkingFinesPageRoutingModule {}
