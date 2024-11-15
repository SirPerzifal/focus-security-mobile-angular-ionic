import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentFacilityBookingsPageRoutingModule } from './resident-facility-bookings-routing.module';

import { ResidentFacilityBookingsPage } from './resident-facility-bookings.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentFacilityBookingsPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ResidentFacilityBookingsPage]
})
export class ResidentFacilityBookingsPageModule {}
