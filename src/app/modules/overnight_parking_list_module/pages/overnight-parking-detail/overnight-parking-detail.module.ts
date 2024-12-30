import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OvernightParkingDetailPageRoutingModule } from './overnight-parking-detail-routing.module';

import { OvernightParkingDetailPage } from './overnight-parking-detail.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OvernightParkingDetailPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [OvernightParkingDetailPage]
})
export class OvernightParkingDetailPageModule {}
