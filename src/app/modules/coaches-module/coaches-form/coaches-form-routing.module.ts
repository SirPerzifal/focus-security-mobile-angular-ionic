import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoachesFormPage } from './coaches-form.page';

const routes: Routes = [
  {
    path: '',
    component: CoachesFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoachesFormPageRoutingModule {}
