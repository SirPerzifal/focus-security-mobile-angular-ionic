import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailHistoryInCommercialPageRoutingModule } from './detail-history-in-commercial-routing.module';

import { DetailHistoryInCommercialPage } from './detail-history-in-commercial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailHistoryInCommercialPageRoutingModule
  ],
  declarations: [DetailHistoryInCommercialPage]
})
export class DetailHistoryInCommercialPageModule {}
