import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryOfEventPageRoutingModule } from './history-of-event-routing.module';

import { HistoryOfEventPage } from './history-of-event.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryOfEventPageRoutingModule,
    SharedModule,
  ],
  declarations: [HistoryOfEventPage]
})
export class HistoryOfEventPageModule {}
