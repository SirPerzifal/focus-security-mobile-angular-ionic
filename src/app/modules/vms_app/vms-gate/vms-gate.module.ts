import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VmsGatePageRoutingModule } from './vms-gate-routing.module';

import { VmsGatePage } from './vms-gate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VmsGatePageRoutingModule
  ],
  declarations: [VmsGatePage]
})
export class VmsGatePageModule {}
