import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractorFormPageRoutingModule } from './contractor-form-routing.module';

import { ContractorFormPage } from './contractor-form.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ContractorFormPageRoutingModule
  ],
  declarations: [ContractorFormPage]
})
export class ContractorFormPageModule {}
