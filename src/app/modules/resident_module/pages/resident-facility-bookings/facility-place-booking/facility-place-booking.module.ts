import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityPlaceBookingPageRoutingModule } from './facility-place-booking-routing.module';

import { FacilityPlaceBookingPage } from './facility-place-booking.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityPlaceBookingPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [FacilityPlaceBookingPage]
})
export class FacilityPlaceBookingPageModule {}
