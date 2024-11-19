import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillsHistoryPageRoutingModule } from './bills-history-routing.module';

import { BillsHistoryPage } from './bills-history.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillsHistoryPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [BillsHistoryPage]
})
export class BillsHistoryPageModule {}
