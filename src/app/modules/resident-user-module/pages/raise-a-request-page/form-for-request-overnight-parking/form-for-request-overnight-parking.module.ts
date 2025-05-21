import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormForRequestOvernightParkingPageRoutingModule } from './form-for-request-overnight-parking-routing.module';

import { FormForRequestOvernightParkingPage } from './form-for-request-overnight-parking.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormForRequestOvernightParkingPageRoutingModule,
    SharedModule
  ],
  declarations: [FormForRequestOvernightParkingPage]
})
export class FormForRequestOvernightParkingPageModule {}
