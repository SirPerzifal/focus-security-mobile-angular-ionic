import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitorInvitingFromHistoryPageRoutingModule } from './visitor-inviting-from-history-routing.module';

import { VisitorInvitingFromHistoryPage } from './visitor-inviting-from-history.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisitorInvitingFromHistoryPageRoutingModule,
    SharedModule
  ],
  declarations: [VisitorInvitingFromHistoryPage]
})
export class VisitorInvitingFromHistoryPageModule {}
