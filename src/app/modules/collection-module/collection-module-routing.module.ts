import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollectionModulePage } from './collection-module.page';

const routes: Routes = [
  {
    path: '',
    component: CollectionModulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectionModulePageRoutingModule {}
