import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentFormVehiclePageRoutingModule } from './payment-form-vehicle-routing.module';

import { PaymentFormVehiclePage } from './payment-form-vehicle.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentFormVehiclePageRoutingModule,
    SharedModule
  ],
  declarations: [PaymentFormVehiclePage]
})
export class PaymentFormVehiclePageModule {}
