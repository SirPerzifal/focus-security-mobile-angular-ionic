import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientDepartmentPage } from './client-department.page';

const routes: Routes = [
  {
    path: '',
    component: ClientDepartmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientDepartmentPageRoutingModule {}
