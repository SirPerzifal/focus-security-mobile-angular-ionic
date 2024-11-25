import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoachesModulePageRoutingModule } from './coaches-module-routing.module';

import { CoachesModulePage } from './coaches-module.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoachesModulePageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [CoachesModulePage]
})
export class CoachesModulePageModule {}
