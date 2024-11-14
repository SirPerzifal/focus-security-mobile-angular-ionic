import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HiredCarPageRoutingModule } from './hired-car-routing.module';

import { HiredCarPage } from './hired-car.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HiredCarPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [HiredCarPage]
})
export class HiredCarPageModule {}
