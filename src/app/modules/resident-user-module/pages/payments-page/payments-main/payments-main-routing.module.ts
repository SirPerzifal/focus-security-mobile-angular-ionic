import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentsMainPage } from './payments-main.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentsMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsMainPageRoutingModule {}
