import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmergencyModulePageRoutingModule } from './emergency-module-routing.module';

import { EmergencyModulePage } from './emergency-module.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmergencyModulePageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [EmergencyModulePage]
})
export class EmergencyModulePageModule {}
