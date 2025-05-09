import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehicleFormPageRoutingModule } from './vehicle-form-routing.module';

import { VehicleFormPage } from './vehicle-form.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VehicleFormPageRoutingModule,
    SharedModule
  ],
  declarations: [VehicleFormPage]
})
export class VehicleFormPageModule {}
