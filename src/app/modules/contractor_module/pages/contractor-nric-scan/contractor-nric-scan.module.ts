import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractorNricScanPageRoutingModule } from './contractor-nric-scan-routing.module';

import { ContractorNricScanPage } from './contractor-nric-scan.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractorNricScanPageRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ContractorNricScanPage]
})
export class ContractorNricScanPageModule {}
