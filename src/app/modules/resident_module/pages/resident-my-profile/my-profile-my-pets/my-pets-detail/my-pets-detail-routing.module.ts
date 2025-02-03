import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyPetsDetailPage } from './my-pets-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MyPetsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPetsDetailPageRoutingModule {}
