import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamilyFormPage } from './family-form.page';

const routes: Routes = [
  {
    path: '',
    component: FamilyFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamilyFormPageRoutingModule {}
