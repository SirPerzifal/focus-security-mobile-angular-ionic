import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeLeaveApplicationPageRoutingModule } from './employee-leave-application-routing.module';

import { EmployeeLeaveApplicationPage } from './employee-leave-application.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeLeaveApplicationPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [EmployeeLeaveApplicationPage]
})
export class EmployeeLeaveApplicationPageModule {}
