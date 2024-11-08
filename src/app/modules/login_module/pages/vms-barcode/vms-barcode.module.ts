import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VmsBarcodePageRoutingModule } from './vms-barcode-routing.module';

import { VmsBarcodePage } from './vms-barcode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VmsBarcodePageRoutingModule
  ],
  declarations: [VmsBarcodePage]
})
export class VmsBarcodePageModule {}
