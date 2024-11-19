import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillsFinesPage } from './bills-fines.page';

const routes: Routes = [
  {
    path: '',
    component: BillsFinesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillsFinesPageRoutingModule {}
