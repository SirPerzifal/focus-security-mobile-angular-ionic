import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsBlacklistDetailPageRoutingModule } from './records-blacklist-detail-routing.module';

import { RecordsBlacklistDetailPage } from './records-blacklist-detail.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsBlacklistDetailPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [RecordsBlacklistDetailPage]
})
export class RecordsBlacklistDetailPageModule {}
