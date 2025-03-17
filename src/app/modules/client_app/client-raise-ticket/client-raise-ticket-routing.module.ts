import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientRaiseTicketPage } from './client-raise-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: ClientRaiseTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRaiseTicketPageRoutingModule {}
