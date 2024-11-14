import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteFromHistoryPageRoutingModule } from './invite-from-history-routing.module';

import { InviteFromHistoryPage } from './invite-from-history.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InviteFromHistoryPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [InviteFromHistoryPage]
})
export class InviteFromHistoryPageModule {}
