import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryInVisitorPageRoutingModule } from './history-in-visitor-routing.module';

import { HistoryInVisitorPage } from './history-in-visitor.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryInVisitorPageRoutingModule,
    SharedModule
  ],
  declarations: [HistoryInVisitorPage]
})
export class HistoryInVisitorPageModule {}
