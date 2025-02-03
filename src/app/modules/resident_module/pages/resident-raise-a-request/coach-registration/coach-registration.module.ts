import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoachRegistrationPageRoutingModule } from './coach-registration-routing.module';

import { CoachRegistrationPage } from './coach-registration.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoachRegistrationPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [CoachRegistrationPage]
})
export class CoachRegistrationPageModule {}
