import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsContractorDetailPageRoutingModule } from './records-contractor-detail-routing.module';

import { RecordsContractorDetailPage } from './records-contractor-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsContractorDetailPageRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [RecordsContractorDetailPage]
})
export class RecordsContractorDetailPageModule {}
