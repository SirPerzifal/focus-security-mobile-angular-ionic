import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsContractorPageRoutingModule } from './records-contractor-routing.module';

import { RecordsContractorPage } from './records-contractor.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsContractorPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [RecordsContractorPage]
})
export class RecordsContractorPageModule {}
