import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationMainPage } from './notification-main.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationMainPageRoutingModule {}
