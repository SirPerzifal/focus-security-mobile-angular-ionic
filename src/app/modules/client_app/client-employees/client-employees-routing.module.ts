import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientEmployeesPage } from './client-employees.page';

const routes: Routes = [
  {
    path: '',
    component: ClientEmployeesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientEmployeesPageRoutingModule {}
