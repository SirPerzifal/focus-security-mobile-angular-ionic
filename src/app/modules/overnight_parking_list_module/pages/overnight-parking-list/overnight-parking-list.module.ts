import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OvernightParkingListPageRoutingModule } from './overnight-parking-list-routing.module';

import { OvernightParkingListPage } from './overnight-parking-list.page';

import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SharedModule,
    OvernightParkingListPageRoutingModule
  ],
  declarations: [OvernightParkingListPage]
})
export class OvernightParkingListPageModule {}
