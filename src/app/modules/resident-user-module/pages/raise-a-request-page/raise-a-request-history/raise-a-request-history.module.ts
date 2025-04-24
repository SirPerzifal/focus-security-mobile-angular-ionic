import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RaiseARequestHistoryPageRoutingModule } from './raise-a-request-history-routing.module';

import { RaiseARequestHistoryPage } from './raise-a-request-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RaiseARequestHistoryPageRoutingModule
  ],
  declarations: [RaiseARequestHistoryPage]
})
export class RaiseARequestHistoryPageModule {}
