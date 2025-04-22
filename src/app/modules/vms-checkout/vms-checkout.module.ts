import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VmsCheckoutPageRoutingModule } from './vms-checkout-routing.module';

import { VmsCheckoutPage } from './vms-checkout.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VmsCheckoutPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [VmsCheckoutPage]
})
export class VmsCheckoutPageModule {}
