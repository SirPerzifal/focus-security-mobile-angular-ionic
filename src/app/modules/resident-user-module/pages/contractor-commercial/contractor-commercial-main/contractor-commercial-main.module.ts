import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractorCommercialMainPageRoutingModule } from './contractor-commercial-main-routing.module';

import { ContractorCommercialMainPage } from './contractor-commercial-main.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractorCommercialMainPageRoutingModule,
    SharedModule
  ],
  declarations: [ContractorCommercialMainPage]
})
export class ContractorCommercialMainPageModule {}
