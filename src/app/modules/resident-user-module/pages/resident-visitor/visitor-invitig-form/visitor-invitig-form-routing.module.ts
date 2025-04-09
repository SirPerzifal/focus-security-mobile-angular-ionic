import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitorInvitigFormPage } from './visitor-invitig-form.page';

const routes: Routes = [
  {
    path: '',
    component: VisitorInvitigFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitorInvitigFormPageRoutingModule {}
