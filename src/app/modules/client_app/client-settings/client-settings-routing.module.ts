import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientSettingsPage } from './client-settings.page';

const routes: Routes = [
  {
    path: '',
    component: ClientSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientSettingsPageRoutingModule {}
