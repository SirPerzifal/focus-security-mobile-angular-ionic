import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OvernightParkingModalPageRoutingModule } from './overnight-parking-modal-routing.module';

import { OvernightParkingModalPage } from './overnight-parking-modal.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OvernightParkingModalPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [OvernightParkingModalPage]
})
export class OvernightParkingModalPageModule {}
