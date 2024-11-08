import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoveFormPage } from './move-form.page';

const routes: Routes = [
  {
    path: '',
    component: MoveFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoveFormPageRoutingModule {}
