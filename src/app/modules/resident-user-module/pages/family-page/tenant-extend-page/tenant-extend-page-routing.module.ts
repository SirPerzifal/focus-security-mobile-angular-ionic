import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TenantExtendPagePage } from './tenant-extend-page.page';

const routes: Routes = [
  {
    path: '',
    component: TenantExtendPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenantExtendPagePageRoutingModule {}
