import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehicleRecordsPagePageRoutingModule } from './vehicle-records-page-routing.module';

import { VehicleRecordsPagePage } from './vehicle-records-page.page';

import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SharedModule,
    VehicleRecordsPagePageRoutingModule
  ],
  declarations: [VehicleRecordsPagePage]
})
export class VehicleRecordsPagePageModule {}
