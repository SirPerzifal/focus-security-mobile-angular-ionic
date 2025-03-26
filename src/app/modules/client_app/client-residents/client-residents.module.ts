import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientResidentsPageRoutingModule } from './client-residents-routing.module';

import { ClientResidentsPage } from './client-residents.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientResidentsPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ClientResidentsPage]
})
export class ClientResidentsPageModule {}
