import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceFacilityBookingPageRoutingModule } from './place-facility-booking-routing.module';

import { PlaceFacilityBookingPage } from './place-facility-booking.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceFacilityBookingPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [PlaceFacilityBookingPage]
})
export class PlaceFacilityBookingPageModule {}
