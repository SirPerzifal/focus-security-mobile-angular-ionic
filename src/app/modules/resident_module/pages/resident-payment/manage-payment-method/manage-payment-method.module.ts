import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagePaymentMethodPageRoutingModule } from './manage-payment-method-routing.module';

import { ManagePaymentMethodPage } from './manage-payment-method.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagePaymentMethodPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ManagePaymentMethodPage]
})
export class ManagePaymentMethodPageModule {}
