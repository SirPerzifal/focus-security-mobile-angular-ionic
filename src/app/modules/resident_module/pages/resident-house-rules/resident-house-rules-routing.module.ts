import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentHouseRulesPage } from './resident-house-rules.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentHouseRulesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentHouseRulesPageRoutingModule {}
