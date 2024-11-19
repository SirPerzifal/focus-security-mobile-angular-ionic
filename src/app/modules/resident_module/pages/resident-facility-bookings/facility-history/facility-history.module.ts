import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacilityHistoryPageRoutingModule } from './facility-history-routing.module';

import { FacilityHistoryPage } from './facility-history.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacilityHistoryPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [FacilityHistoryPage]
})
export class FacilityHistoryPageModule {}
