import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentDoorAccessPageRoutingModule } from './resident-door-access-routing.module';

import { ResidentDoorAccessPage } from './resident-door-access.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentDoorAccessPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ResidentDoorAccessPage]
})
export class ResidentDoorAccessPageModule {}
