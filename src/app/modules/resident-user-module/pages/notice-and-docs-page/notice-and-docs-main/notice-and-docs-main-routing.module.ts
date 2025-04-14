import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoticeAndDocsMainPage } from './notice-and-docs-main.page';

const routes: Routes = [
  {
    path: '',
    component: NoticeAndDocsMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoticeAndDocsMainPageRoutingModule {}
