import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepositsPagePage } from './deposits-page.page';

const routes: Routes = [
  {
    path: '',
    component: DepositsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepositsPagePageRoutingModule {}
