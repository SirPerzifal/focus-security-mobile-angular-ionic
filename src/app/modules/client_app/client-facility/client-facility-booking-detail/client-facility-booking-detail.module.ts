import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientFacilityBookingDetailPageRoutingModule } from './client-facility-booking-detail-routing.module';

import { ClientFacilityBookingDetailPage } from './client-facility-booking-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientFacilityBookingDetailPageRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ClientFacilityBookingDetailPage]
})
export class ClientFacilityBookingDetailPageModule {}
