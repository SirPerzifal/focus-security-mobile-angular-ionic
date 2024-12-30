import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsWheelClampedPageRoutingModule } from './records-wheel-clamped-routing.module';

import { RecordsWheelClampedPage } from './records-wheel-clamped.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsWheelClampedPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [RecordsWheelClampedPage]
})
export class RecordsWheelClampedPageModule {}
