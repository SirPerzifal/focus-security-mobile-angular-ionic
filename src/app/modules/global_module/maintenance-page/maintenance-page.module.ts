import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenancePagePageRoutingModule } from './maintenance-page-routing.module';

import { MaintenancePagePage } from './maintenance-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenancePagePageRoutingModule
  ],
  declarations: [MaintenancePagePage]
})
export class MaintenancePagePageModule {}
