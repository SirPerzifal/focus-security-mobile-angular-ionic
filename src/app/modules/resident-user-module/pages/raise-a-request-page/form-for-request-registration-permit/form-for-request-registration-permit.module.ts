import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormForRequestRegistrationPermitPageRoutingModule } from './form-for-request-registration-permit-routing.module';

import { FormForRequestRegistrationPermitPage } from './form-for-request-registration-permit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormForRequestRegistrationPermitPageRoutingModule
  ],
  declarations: [FormForRequestRegistrationPermitPage]
})
export class FormForRequestRegistrationPermitPageModule {}
