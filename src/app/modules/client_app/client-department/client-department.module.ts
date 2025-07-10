import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientDepartmentPageRoutingModule } from './client-department-routing.module';

import { ClientDepartmentPage } from './client-department.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientDepartmentPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [ClientDepartmentPage]
})
export class ClientDepartmentPageModule {}
