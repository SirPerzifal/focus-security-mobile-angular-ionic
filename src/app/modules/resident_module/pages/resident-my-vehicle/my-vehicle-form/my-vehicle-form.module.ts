import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyVehicleFormPageRoutingModule } from './my-vehicle-form-routing.module';

import { MyVehicleFormPage } from './my-vehicle-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyVehicleFormPageRoutingModule
  ],
  declarations: [MyVehicleFormPage]
})
export class MyVehicleFormPageModule {}
