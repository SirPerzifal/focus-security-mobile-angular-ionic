import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientNotificationPage } from './client-notification.page';

const routes: Routes = [
  {
    path: '',
    component: ClientNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientNotificationPageRoutingModule {}
