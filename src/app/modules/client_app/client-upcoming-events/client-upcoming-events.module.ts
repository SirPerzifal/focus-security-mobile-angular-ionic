import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientUpcomingEventsPageRoutingModule } from './client-upcoming-events-routing.module';

import { ClientUpcomingEventsPage } from './client-upcoming-events.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientUpcomingEventsPageRoutingModule,
    SharedModule,
    ComponentsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: [ClientUpcomingEventsPage]
})
export class ClientUpcomingEventsPageModule {}
