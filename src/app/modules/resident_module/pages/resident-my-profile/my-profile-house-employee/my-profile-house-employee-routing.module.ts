import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyProfileHouseEmployeePage } from './my-profile-house-employee.page';

const routes: Routes = [
  {
    path: '',
    component: MyProfileHouseEmployeePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfileHouseEmployeePageRoutingModule {}
