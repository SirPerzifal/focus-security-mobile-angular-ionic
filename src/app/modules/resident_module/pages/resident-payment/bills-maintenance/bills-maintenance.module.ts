import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillsMaintenancePageRoutingModule } from './bills-maintenance-routing.module';

import { BillsMaintenancePage } from './bills-maintenance.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillsMaintenancePageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [BillsMaintenancePage]
})
export class BillsMaintenancePageModule {}
