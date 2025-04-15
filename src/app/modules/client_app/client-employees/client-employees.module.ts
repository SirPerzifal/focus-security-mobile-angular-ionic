import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientEmployeesPageRoutingModule } from './client-employees-routing.module';

import { ClientEmployeesPage } from './client-employees.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientEmployeesPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [ClientEmployeesPage]
})
export class ClientEmployeesPageModule {}
