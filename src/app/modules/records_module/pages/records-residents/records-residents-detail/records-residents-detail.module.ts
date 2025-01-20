import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsResidentsDetailPageRoutingModule } from './records-residents-detail-routing.module';

import { RecordsResidentsDetailPage } from './records-residents-detail.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsResidentsDetailPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [RecordsResidentsDetailPage]
})
export class RecordsResidentsDetailPageModule {}
