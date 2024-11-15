import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryDetailsPageRoutingModule } from './history-details-routing.module';

import { HistoryDetailsPage } from './history-details.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryDetailsPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [HistoryDetailsPage]
})
export class HistoryDetailsPageModule {}
