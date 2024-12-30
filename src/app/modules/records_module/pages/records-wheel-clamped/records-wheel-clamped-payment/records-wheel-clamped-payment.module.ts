import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsWheelClampedPaymentPageRoutingModule } from './records-wheel-clamped-payment-routing.module';

import { RecordsWheelClampedPaymentPage } from './records-wheel-clamped-payment.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsWheelClampedPaymentPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [RecordsWheelClampedPaymentPage]
})
export class RecordsWheelClampedPaymentPageModule {}
