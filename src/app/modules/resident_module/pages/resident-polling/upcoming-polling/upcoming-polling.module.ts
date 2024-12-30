import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpcomingPollingPageRoutingModule } from './upcoming-polling-routing.module';

import { UpcomingPollingPage } from './upcoming-polling.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpcomingPollingPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [UpcomingPollingPage]
})
export class UpcomingPollingPageModule {}
