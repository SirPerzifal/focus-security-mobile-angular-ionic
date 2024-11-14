import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterResidentPageRoutingModule } from './register-resident-routing.module';

import { RegisterResidentPage } from './register-resident.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterResidentPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [RegisterResidentPage]
})
export class RegisterResidentPageModule {}
