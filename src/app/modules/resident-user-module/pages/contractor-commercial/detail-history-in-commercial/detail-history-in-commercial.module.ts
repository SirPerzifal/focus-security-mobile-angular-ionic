import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailHistoryInCommercialPageRoutingModule } from './detail-history-in-commercial-routing.module';

import { DetailHistoryInCommercialPage } from './detail-history-in-commercial.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailHistoryInCommercialPageRoutingModule,
    SharedModule
  ],
  declarations: [DetailHistoryInCommercialPage]
})
export class DetailHistoryInCommercialPageModule {}
