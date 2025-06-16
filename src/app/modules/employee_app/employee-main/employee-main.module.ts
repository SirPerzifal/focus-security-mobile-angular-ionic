import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeMainPageRoutingModule } from './employee-main-routing.module';

import { EmployeeMainPage } from './employee-main.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeMainPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [EmployeeMainPage]
})
export class EmployeeMainPageModule {}
