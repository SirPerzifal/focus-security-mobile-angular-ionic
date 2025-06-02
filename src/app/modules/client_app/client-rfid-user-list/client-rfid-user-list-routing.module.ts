import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientRfidUserListPage } from './client-rfid-user-list.page';

const routes: Routes = [
  {
    path: '',
    component: ClientRfidUserListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRfidUserListPageRoutingModule {}
