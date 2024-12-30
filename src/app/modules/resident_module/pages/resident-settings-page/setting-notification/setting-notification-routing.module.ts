import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingNotificationPage } from './setting-notification.page';

const routes: Routes = [
  {
    path: '',
    component: SettingNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingNotificationPageRoutingModule {}
