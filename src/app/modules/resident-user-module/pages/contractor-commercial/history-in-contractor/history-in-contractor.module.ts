import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryInContractorPageRoutingModule } from './history-in-contractor-routing.module';

import { HistoryInContractorPage } from './history-in-contractor.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryInContractorPageRoutingModule,
    SharedModule
  ],
  declarations: [HistoryInContractorPage]
})
export class HistoryInContractorPageModule {}
