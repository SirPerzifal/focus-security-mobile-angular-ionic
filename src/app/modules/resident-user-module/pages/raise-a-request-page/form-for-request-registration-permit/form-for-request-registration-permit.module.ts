import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormForRequestRegistrationPermitPageRoutingModule } from './form-for-request-registration-permit-routing.module';

import { FormForRequestRegistrationPermitPage } from './form-for-request-registration-permit.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormForRequestRegistrationPermitPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [FormForRequestRegistrationPermitPage]
})
export class FormForRequestRegistrationPermitPageModule {}
