import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsWarningDetailPageRoutingModule } from './records-warning-detail-routing.module';

import { RecordsWarningDetailPage } from './records-warning-detail.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsWarningDetailPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [RecordsWarningDetailPage]
})
export class RecordsWarningDetailPageModule {}
