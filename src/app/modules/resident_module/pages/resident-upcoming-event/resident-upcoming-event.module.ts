import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentUpcomingEventPageRoutingModule } from './resident-upcoming-event-routing.module';

import { ResidentUpcomingEventPage } from './resident-upcoming-event.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentUpcomingEventPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ResidentUpcomingEventPage]
})
export class ResidentUpcomingEventPageModule {}
