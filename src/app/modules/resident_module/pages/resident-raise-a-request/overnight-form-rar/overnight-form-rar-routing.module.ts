import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OvernightFormRarPage } from './overnight-form-rar.page';

const routes: Routes = [
  {
    path: '',
    component: OvernightFormRarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OvernightFormRarPageRoutingModule {}
