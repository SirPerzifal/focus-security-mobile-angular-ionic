import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientHouseRulesPage } from './client-house-rules.page';

const routes: Routes = [
  {
    path: '',
    component: ClientHouseRulesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientHouseRulesPageRoutingModule {}
