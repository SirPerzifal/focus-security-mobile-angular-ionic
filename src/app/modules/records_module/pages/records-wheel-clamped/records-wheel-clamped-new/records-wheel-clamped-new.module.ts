import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsWheelClampedNewPageRoutingModule } from './records-wheel-clamped-new-routing.module';

import { RecordsWheelClampedNewPage } from './records-wheel-clamped-new.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsWheelClampedNewPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [RecordsWheelClampedNewPage]
})
export class RecordsWheelClampedNewPageModule {}
