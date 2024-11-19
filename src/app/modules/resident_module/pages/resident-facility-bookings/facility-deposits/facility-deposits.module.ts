import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityDepositsPageRoutingModule } from './facility-deposits-routing.module';

import { FacilityDepositsPage } from './facility-deposits.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityDepositsPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [FacilityDepositsPage]
})
export class FacilityDepositsPageModule {}
