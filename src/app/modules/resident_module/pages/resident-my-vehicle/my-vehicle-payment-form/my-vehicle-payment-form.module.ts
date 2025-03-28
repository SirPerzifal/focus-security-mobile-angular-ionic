import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyVehiclePaymentFormPageRoutingModule } from './my-vehicle-payment-form-routing.module';

import { MyVehiclePaymentFormPage } from './my-vehicle-payment-form.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyVehiclePaymentFormPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [MyVehiclePaymentFormPage]
})
export class MyVehiclePaymentFormPageModule {}
