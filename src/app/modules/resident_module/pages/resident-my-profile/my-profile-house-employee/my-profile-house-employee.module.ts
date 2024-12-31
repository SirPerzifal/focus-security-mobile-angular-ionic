import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProfileHouseEmployeePageRoutingModule } from './my-profile-house-employee-routing.module';

import { MyProfileHouseEmployeePage } from './my-profile-house-employee.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProfileHouseEmployeePageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [MyProfileHouseEmployeePage]
})
export class MyProfileHouseEmployeePageModule {}
