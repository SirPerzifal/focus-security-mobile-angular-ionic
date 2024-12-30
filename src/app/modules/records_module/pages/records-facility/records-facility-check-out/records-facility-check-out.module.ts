import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsFacilityCheckOutPageRoutingModule } from './records-facility-check-out-routing.module';

import { RecordsFacilityCheckOutPage } from './records-facility-check-out.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsFacilityCheckOutPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [RecordsFacilityCheckOutPage]
})
export class RecordsFacilityCheckOutPageModule {}
