import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitorRecordDetailPageRoutingModule } from './visitor-record-detail-routing.module';

import { VisitorRecordDetailPage } from './visitor-record-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';

import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ComponentsModule,
    VisitorRecordDetailPageRoutingModule
  ],
  declarations: [VisitorRecordDetailPage]
})
export class VisitorRecordDetailPageModule {}
