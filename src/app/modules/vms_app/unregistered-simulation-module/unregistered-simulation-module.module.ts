import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnregisteredSimulationModulePageRoutingModule } from './unregistered-simulation-module-routing.module';

import { UnregisteredSimulationModulePage } from './unregistered-simulation-module.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnregisteredSimulationModulePageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [UnregisteredSimulationModulePage]
})
export class UnregisteredSimulationModulePageModule {}
