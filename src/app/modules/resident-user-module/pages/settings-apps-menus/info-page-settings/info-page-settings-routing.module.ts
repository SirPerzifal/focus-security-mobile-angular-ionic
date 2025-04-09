import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoPageSettingsPage } from './info-page-settings.page';

const routes: Routes = [
  {
    path: '',
    component: InfoPageSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoPageSettingsPageRoutingModule {}
