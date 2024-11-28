import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentMyVehiclePageRoutingModule } from './resident-my-vehicle-routing.module';

import { ResidentMyVehiclePage } from './resident-my-vehicle.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentMyVehiclePageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ResidentMyVehiclePage]
})
export class ResidentMyVehiclePageModule {}
