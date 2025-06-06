import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormAndHistoryAppealParkingFinesPageRoutingModule } from './form-and-history-appeal-parking-fines-routing.module';

import { FormAndHistoryAppealParkingFinesPage } from './form-and-history-appeal-parking-fines.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormAndHistoryAppealParkingFinesPageRoutingModule,
    SharedModule
  ],
  declarations: [FormAndHistoryAppealParkingFinesPage]
})
export class FormAndHistoryAppealParkingFinesPageModule {}
