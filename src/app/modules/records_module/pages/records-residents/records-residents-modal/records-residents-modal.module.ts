import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsResidentsModalPageRoutingModule } from './records-residents-modal-routing.module';

import { RecordsResidentsModalPage } from './records-residents-modal.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsResidentsModalPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [RecordsResidentsModalPage]
})
export class RecordsResidentsModalPageModule {}
