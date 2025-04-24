import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyVehicleMainPageRoutingModule } from './my-vehicle-main-routing.module';

import { MyVehicleMainPage } from './my-vehicle-main.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyVehicleMainPageRoutingModule,
    SharedModule
  ],
  declarations: [MyVehicleMainPage]
})
export class MyVehicleMainPageModule {}
