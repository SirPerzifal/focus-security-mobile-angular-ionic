import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpcomingEventCalendarViewPageRoutingModule } from './upcoming-event-calendar-view-routing.module';

import { UpcomingEventCalendarViewPage } from './upcoming-event-calendar-view.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpcomingEventCalendarViewPageRoutingModule,
    ComponentsModule,
    SharedModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: [UpcomingEventCalendarViewPage],
})
export class UpcomingEventCalendarViewPageModule {}
