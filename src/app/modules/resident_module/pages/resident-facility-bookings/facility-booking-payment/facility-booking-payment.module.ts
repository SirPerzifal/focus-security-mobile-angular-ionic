import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityBookingPaymentPageRoutingModule } from './facility-booking-payment-routing.module';

import { FacilityBookingPaymentPage } from './facility-booking-payment.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityBookingPaymentPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [FacilityBookingPaymentPage]
})
export class FacilityBookingPaymentPageModule {}