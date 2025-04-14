import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoorAccessMainPageRoutingModule } from './door-access-main-routing.module';

import { DoorAccessMainPage } from './door-access-main.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoorAccessMainPageRoutingModule,
    SharedModule
  ],
  declarations: [DoorAccessMainPage]
})
export class DoorAccessMainPageModule {}
