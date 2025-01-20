import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoachRegistrationPageRoutingModule } from './coach-registration-routing.module';

import { CoachRegistrationPage } from './coach-registration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoachRegistrationPageRoutingModule
  ],
  declarations: [CoachRegistrationPage]
})
export class CoachRegistrationPageModule {}
