import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoorAccessMainPageRoutingModule } from './door-access-main-routing.module';

import { DoorAccessMainPage } from './door-access-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoorAccessMainPageRoutingModule
  ],
  declarations: [DoorAccessMainPage]
})
export class DoorAccessMainPageModule {}
