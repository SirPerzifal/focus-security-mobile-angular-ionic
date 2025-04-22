import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityProcessToPaymentPageRoutingModule } from './facility-process-to-payment-routing.module';

import { FacilityProcessToPaymentPage } from './facility-process-to-payment.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityProcessToPaymentPageRoutingModule,
    SharedModule
  ],
  declarations: [FacilityProcessToPaymentPage]
})
export class FacilityProcessToPaymentPageModule {}
