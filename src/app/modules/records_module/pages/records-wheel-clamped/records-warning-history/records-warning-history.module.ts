import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsWarningHistoryPageRoutingModule } from './records-warning-history-routing.module';

import { RecordsWarningHistoryPage } from './records-warning-history.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsWarningHistoryPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [RecordsWarningHistoryPage]
})
export class RecordsWarningHistoryPageModule {}
