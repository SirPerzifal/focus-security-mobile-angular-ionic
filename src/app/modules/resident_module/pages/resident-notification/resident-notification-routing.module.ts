import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentNotificationPage } from './resident-notification.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentNotificationPageRoutingModule {}
