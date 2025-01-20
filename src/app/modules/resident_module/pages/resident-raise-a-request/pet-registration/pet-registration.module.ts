import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetRegistrationPageRoutingModule } from './pet-registration-routing.module';

import { PetRegistrationPage } from './pet-registration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetRegistrationPageRoutingModule
  ],
  declarations: [PetRegistrationPage]
})
export class PetRegistrationPageModule {}
