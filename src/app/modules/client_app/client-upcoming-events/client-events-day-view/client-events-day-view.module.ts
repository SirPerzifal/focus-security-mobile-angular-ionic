import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientEventsDayViewPageRoutingModule } from './client-events-day-view-routing.module';

import { ClientEventsDayViewPage } from './client-events-day-view.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientEventsDayViewPageRoutingModule,
    SharedModule,
    ComponentsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: [ClientEventsDayViewPage]
})
export class ClientEventsDayViewPageModule {}
