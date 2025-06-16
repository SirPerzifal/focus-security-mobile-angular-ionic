import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeSchedulePage } from './employee-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeSchedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeSchedulePageRoutingModule {}
