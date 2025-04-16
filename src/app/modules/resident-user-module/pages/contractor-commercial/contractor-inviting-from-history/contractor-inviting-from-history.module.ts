import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractorInvitingFromHistoryPageRoutingModule } from './contractor-inviting-from-history-routing.module';

import { ContractorInvitingFromHistoryPage } from './contractor-inviting-from-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractorInvitingFromHistoryPageRoutingModule
  ],
  declarations: [ContractorInvitingFromHistoryPage]
})
export class ContractorInvitingFromHistoryPageModule {}
