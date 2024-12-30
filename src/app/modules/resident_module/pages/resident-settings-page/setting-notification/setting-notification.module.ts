import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingNotificationPageRoutingModule } from './setting-notification-routing.module';

import { SettingNotificationPage } from './setting-notification.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingNotificationPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [SettingNotificationPage]
})
export class SettingNotificationPageModule {}
