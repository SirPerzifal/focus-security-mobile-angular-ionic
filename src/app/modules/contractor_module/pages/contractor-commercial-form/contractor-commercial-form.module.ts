import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractorCommercialFormPageRoutingModule } from './contractor-commercial-form-routing.module';

import { ContractorCommercialFormPage } from './contractor-commercial-form.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractorCommercialFormPageRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [ContractorCommercialFormPage]
})
export class ContractorCommercialFormPageModule {}
