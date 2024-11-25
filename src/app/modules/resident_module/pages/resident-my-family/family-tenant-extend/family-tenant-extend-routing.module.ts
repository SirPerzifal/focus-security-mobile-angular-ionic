import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamilyTenantExtendPage } from './family-tenant-extend.page';

const routes: Routes = [
  {
    path: '',
    component: FamilyTenantExtendPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamilyTenantExtendPageRoutingModule {}
