import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientPaymentSettingsPageRoutingModule } from './client-payment-settings-routing.module';

import { ClientPaymentSettingsPage } from './client-payment-settings.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientPaymentSettingsPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [ClientPaymentSettingsPage]
})
export class ClientPaymentSettingsPageModule {}
