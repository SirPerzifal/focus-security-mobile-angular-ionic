import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyVehicleFormPageRoutingModule } from './my-vehicle-form-routing.module';

import { MyVehicleFormPage } from './my-vehicle-form.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyVehicleFormPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [MyVehicleFormPage]
})
export class MyVehicleFormPageModule {}
