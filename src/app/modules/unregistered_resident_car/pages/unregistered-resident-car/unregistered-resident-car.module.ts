import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnregisteredResidentCarPageRoutingModule } from './unregistered-resident-car-routing.module';

import { UnregisteredResidentCarPage } from './unregistered-resident-car.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnregisteredResidentCarPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [UnregisteredResidentCarPage]
})
export class UnregisteredResidentCarPageModule {}
