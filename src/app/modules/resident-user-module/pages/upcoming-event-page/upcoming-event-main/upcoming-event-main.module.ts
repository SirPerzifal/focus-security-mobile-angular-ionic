import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpcomingEventMainPageRoutingModule } from './upcoming-event-main-routing.module';

import { UpcomingEventMainPage } from './upcoming-event-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpcomingEventMainPageRoutingModule
  ],
  declarations: [UpcomingEventMainPage]
})
export class UpcomingEventMainPageModule {}
