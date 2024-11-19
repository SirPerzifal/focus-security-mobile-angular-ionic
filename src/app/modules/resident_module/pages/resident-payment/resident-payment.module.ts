import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentPaymentPageRoutingModule } from './resident-payment-routing.module';

import { ResidentPaymentPage } from './resident-payment.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentPaymentPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ResidentPaymentPage]
})
export class ResidentPaymentPageModule {}
