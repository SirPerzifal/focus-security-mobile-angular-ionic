import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstateModalPage } from './estate-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EstateModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstateModalPageRoutingModule {}
