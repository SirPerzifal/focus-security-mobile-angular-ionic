import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeLeaveApplicationPage } from './employee-leave-application.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeLeaveApplicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeLeaveApplicationPageRoutingModule {}
