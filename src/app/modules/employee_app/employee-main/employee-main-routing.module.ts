import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeMainPage } from './employee-main.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeMainPageRoutingModule {}
