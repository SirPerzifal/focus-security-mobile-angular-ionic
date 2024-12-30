import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsFacilityPageRoutingModule } from './records-facility-routing.module';

import { RecordsFacilityPage } from './records-facility.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsFacilityPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [RecordsFacilityPage]
})
export class RecordsFacilityPageModule {}
