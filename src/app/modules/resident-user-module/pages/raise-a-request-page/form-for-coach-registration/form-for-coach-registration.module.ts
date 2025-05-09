import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormForCoachRegistrationPageRoutingModule } from './form-for-coach-registration-routing.module';

import { FormForCoachRegistrationPage } from './form-for-coach-registration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormForCoachRegistrationPageRoutingModule
  ],
  declarations: [FormForCoachRegistrationPage]
})
export class FormForCoachRegistrationPageModule {}
