import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavouriteAnnouncementPage } from './favourite-announcement.page';

const routes: Routes = [
  {
    path: '',
    component: FavouriteAnnouncementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavouriteAnnouncementPageRoutingModule {}
