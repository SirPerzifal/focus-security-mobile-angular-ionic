import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailHistoryInVisitorPageRoutingModule } from './detail-history-in-visitor-routing.module';

import { DetailHistoryInVisitorPage } from './detail-history-in-visitor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailHistoryInVisitorPageRoutingModule
  ],
  declarations: [DetailHistoryInVisitorPage]
})
export class DetailHistoryInVisitorPageModule {}
