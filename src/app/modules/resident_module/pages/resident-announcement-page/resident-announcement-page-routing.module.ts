import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentAnnouncementPagePage } from './resident-announcement-page.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentAnnouncementPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentAnnouncementPagePageRoutingModule {}
