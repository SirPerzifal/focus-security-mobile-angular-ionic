import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsFacilityDetailPageRoutingModule } from './records-facility-detail-routing.module';

import { RecordsFacilityDetailPage } from './records-facility-detail.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsFacilityDetailPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [RecordsFacilityDetailPage]
})
export class RecordsFacilityDetailPageModule {}
