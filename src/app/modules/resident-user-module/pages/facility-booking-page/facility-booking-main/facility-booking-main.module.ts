import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityBookingMainPageRoutingModule } from './facility-booking-main-routing.module';

import { FacilityBookingMainPage } from './facility-booking-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityBookingMainPageRoutingModule
  ],
  declarations: [FacilityBookingMainPage]
})
export class FacilityBookingMainPageModule {}
