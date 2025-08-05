import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VmsGatePageRoutingModule } from './vms-gate-routing.module';

import { VmsGatePage } from './vms-gate.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VmsGatePageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [VmsGatePage]
})
export class VmsGatePageModule {}
