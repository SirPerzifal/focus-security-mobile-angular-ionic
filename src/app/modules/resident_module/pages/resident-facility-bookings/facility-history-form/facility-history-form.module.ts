import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityHistoryFormPageRoutingModule } from './facility-history-form-routing.module';

import { FacilityHistoryFormPage } from './facility-history-form.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityHistoryFormPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [FacilityHistoryFormPage]
})
export class FacilityHistoryFormPageModule {}
