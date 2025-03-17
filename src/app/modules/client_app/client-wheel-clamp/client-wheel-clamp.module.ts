import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientWheelClampPageRoutingModule } from './client-wheel-clamp-routing.module';

import { ClientWheelClampPage } from './client-wheel-clamp.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientWheelClampPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientWheelClampPage]
})
export class ClientWheelClampPageModule {}
