import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoticeAndDocsMainPageRoutingModule } from './notice-and-docs-main-routing.module';

import { NoticeAndDocsMainPage } from './notice-and-docs-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoticeAndDocsMainPageRoutingModule
  ],
  declarations: [NoticeAndDocsMainPage]
})
export class NoticeAndDocsMainPageModule {}
