import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientDocsPage } from './client-docs.page';

const routes: Routes = [
  {
    path: '',
    component: ClientDocsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientDocsPageRoutingModule {}
