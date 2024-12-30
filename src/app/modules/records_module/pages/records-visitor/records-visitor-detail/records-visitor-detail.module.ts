import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsVisitorDetailPageRoutingModule } from './records-visitor-detail-routing.module';

import { RecordsVisitorDetailPage } from './records-visitor-detail.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsVisitorDetailPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [RecordsVisitorDetailPage]
})
export class RecordsVisitorDetailPageModule {}
