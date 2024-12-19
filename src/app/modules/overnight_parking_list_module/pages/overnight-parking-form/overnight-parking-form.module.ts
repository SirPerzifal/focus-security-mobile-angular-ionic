import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OvernightParkingFormPageRoutingModule } from './overnight-parking-form-routing.module';

import { OvernightParkingFormPage } from './overnight-parking-form.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SharedModule,
    OvernightParkingFormPageRoutingModule
  ],
  declarations: [OvernightParkingFormPage]
})
export class OvernightParkingFormPageModule {}
