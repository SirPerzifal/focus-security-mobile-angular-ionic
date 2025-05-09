import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormForRegistrationPetPageRoutingModule } from './form-for-registration-pet-routing.module';

import { FormForRegistrationPetPage } from './form-for-registration-pet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormForRegistrationPetPageRoutingModule
  ],
  declarations: [FormForRegistrationPetPage]
})
export class FormForRegistrationPetPageModule {}
