import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentSettingsPagePage } from './resident-settings-page.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentSettingsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentSettingsPagePageRoutingModule {}
