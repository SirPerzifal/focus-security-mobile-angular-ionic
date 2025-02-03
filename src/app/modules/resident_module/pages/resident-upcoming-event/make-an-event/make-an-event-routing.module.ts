import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MakeAnEventPage } from './make-an-event.page';

const routes: Routes = [
  {
    path: '',
    component: MakeAnEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MakeAnEventPageRoutingModule {}
