import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientEventsDetailPageRoutingModule } from './client-events-detail-routing.module';

import { ClientEventsDetailPage } from './client-events-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientEventsDetailPageRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ClientEventsDetailPage]
})
export class ClientEventsDetailPageModule {}
