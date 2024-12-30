import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryUpcomingEventPageRoutingModule } from './history-upcoming-event-routing.module';

import { HistoryUpcomingEventPage } from './history-upcoming-event.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryUpcomingEventPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [HistoryUpcomingEventPage]
})
export class HistoryUpcomingEventPageModule {}
