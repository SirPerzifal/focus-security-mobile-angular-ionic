import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientTicketDetailPageRoutingModule } from './client-ticket-detail-routing.module';

import { ClientTicketDetailPage } from './client-ticket-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientTicketDetailPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientTicketDetailPage]
})
export class ClientTicketDetailPageModule {}
