import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeSchedulePageRoutingModule } from './employee-schedule-routing.module';

import { EmployeeSchedulePage } from './employee-schedule.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeSchedulePageRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
  declarations: [EmployeeSchedulePage]
})
export class EmployeeSchedulePageModule {}
