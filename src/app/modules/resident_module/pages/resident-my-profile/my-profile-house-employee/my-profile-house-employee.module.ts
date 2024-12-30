import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProfileHouseEmployeePageRoutingModule } from './my-profile-house-employee-routing.module';

import { MyProfileHouseEmployeePage } from './my-profile-house-employee.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProfileHouseEmployeePageRoutingModule
  ],
  declarations: [MyProfileHouseEmployeePage]
})
export class MyProfileHouseEmployeePageModule {}
