import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaVisitorFormPage } from './ma-visitor-form.page';

const routes: Routes = [
  {
    path: '',
    component: MaVisitorFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaVisitorFormPageRoutingModule {}
