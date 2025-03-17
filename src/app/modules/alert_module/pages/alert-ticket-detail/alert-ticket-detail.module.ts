import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertTicketDetailPageRoutingModule } from './alert-ticket-detail-routing.module';

import { AlertTicketDetailPage } from './alert-ticket-detail.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertTicketDetailPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [AlertTicketDetailPage]
})
export class AlertTicketDetailPageModule {}
