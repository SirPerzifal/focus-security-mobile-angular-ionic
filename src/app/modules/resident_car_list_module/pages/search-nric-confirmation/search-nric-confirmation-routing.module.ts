import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchNricConfirmationPage } from './search-nric-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: SearchNricConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchNricConfirmationPageRoutingModule {}
