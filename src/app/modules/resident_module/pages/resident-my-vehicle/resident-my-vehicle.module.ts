import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentMyVehiclePageRoutingModule } from './resident-my-vehicle-routing.module';

import { ResidentMyVehiclePage } from './resident-my-vehicle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentMyVehiclePageRoutingModule
  ],
  declarations: [ResidentMyVehiclePage]
})
export class ResidentMyVehiclePageModule {}
