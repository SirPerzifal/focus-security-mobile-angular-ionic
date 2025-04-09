import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientNotificationPageRoutingModule } from './client-notification-routing.module';

import { ClientNotificationPage } from './client-notification.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientNotificationPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [ClientNotificationPage]
})
export class ClientNotificationPageModule {}
