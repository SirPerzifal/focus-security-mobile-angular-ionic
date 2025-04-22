import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MakeANewEventPage } from './make-a-new-event.page';

const routes: Routes = [
  {
    path: '',
    component: MakeANewEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MakeANewEventPageRoutingModule {}
