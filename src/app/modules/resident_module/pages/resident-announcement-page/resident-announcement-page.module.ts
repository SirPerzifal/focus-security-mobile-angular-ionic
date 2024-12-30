import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentAnnouncementPagePageRoutingModule } from './resident-announcement-page-routing.module';

import { ResidentAnnouncementPagePage } from './resident-announcement-page.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentAnnouncementPagePageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ResidentAnnouncementPagePage]
})
export class ResidentAnnouncementPagePageModule {}
