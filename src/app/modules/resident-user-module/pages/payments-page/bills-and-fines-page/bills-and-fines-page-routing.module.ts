import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillsAndFinesPagePage } from './bills-and-fines-page.page';

const routes: Routes = [
  {
    path: '',
    component: BillsAndFinesPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillsAndFinesPagePageRoutingModule {}
