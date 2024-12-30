import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentNotificationPageRoutingModule } from './resident-notification-routing.module';

import { ResidentNotificationPage } from './resident-notification.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentNotificationPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ResidentNotificationPage]
})
export class ResidentNotificationPageModule {}
