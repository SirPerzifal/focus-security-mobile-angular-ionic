import { ComponentRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyVehicleDetailPageRoutingModule } from './my-vehicle-detail-routing.module';

import { MyVehicleDetailPage } from './my-vehicle-detail.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyVehicleDetailPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [MyVehicleDetailPage]
})
export class MyVehicleDetailPageModule {}
