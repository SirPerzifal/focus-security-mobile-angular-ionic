import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientDoorAccessPageRoutingModule } from './client-door-access-routing.module';

import { ClientDoorAccessPage } from './client-door-access.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientDoorAccessPageRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ClientDoorAccessPage]
})
export class ClientDoorAccessPageModule {}
