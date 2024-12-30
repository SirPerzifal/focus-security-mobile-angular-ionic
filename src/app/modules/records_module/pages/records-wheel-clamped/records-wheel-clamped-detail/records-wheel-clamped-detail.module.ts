import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsWheelClampedDetailPageRoutingModule } from './records-wheel-clamped-detail-routing.module';

import { RecordsWheelClampedDetailPage } from './records-wheel-clamped-detail.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsWheelClampedDetailPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [RecordsWheelClampedDetailPage]
})
export class RecordsWheelClampedDetailPageModule {}
