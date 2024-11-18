import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityNewBookingPageRoutingModule } from './facility-new-booking-routing.module';

import { FacilityNewBookingPage } from './facility-new-booking.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityNewBookingPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [FacilityNewBookingPage]
})
export class FacilityNewBookingPageModule {}
