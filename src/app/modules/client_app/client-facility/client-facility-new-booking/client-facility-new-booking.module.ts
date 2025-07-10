import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientFacilityNewBookingPageRoutingModule } from './client-facility-new-booking-routing.module';

import { ClientFacilityNewBookingPage } from './client-facility-new-booking.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientFacilityNewBookingPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [ClientFacilityNewBookingPage]
})
export class ClientFacilityNewBookingPageModule {}
