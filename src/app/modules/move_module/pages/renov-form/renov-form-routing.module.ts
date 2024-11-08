import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenovFormPage } from './renov-form.page';

const routes: Routes = [
  {
    path: '',
    component: RenovFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenovFormPageRoutingModule {}
