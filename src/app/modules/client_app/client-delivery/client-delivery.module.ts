import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientDeliveryPageRoutingModule } from './client-delivery-routing.module';

import { ClientDeliveryPage } from './client-delivery.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientDeliveryPageRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ClientDeliveryPage]
})
export class ClientDeliveryPageModule {}
