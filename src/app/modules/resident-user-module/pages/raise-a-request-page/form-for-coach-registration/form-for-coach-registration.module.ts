import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormForCoachRegistrationPageRoutingModule } from './form-for-coach-registration-routing.module';

import { FormForCoachRegistrationPage } from './form-for-coach-registration.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormForCoachRegistrationPageRoutingModule,
    SharedModule
  ],
  declarations: [FormForCoachRegistrationPage]
})
export class FormForCoachRegistrationPageModule {}
