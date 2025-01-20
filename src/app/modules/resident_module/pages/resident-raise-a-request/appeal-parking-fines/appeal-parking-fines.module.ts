import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppealParkingFinesPageRoutingModule } from './appeal-parking-fines-routing.module';

import { AppealParkingFinesPage } from './appeal-parking-fines.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppealParkingFinesPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [AppealParkingFinesPage]
})
export class AppealParkingFinesPageModule {}
