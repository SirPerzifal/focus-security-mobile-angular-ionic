import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientReportsPageRoutingModule } from './client-reports-routing.module';

import { ClientReportsPage } from './client-reports.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientReportsPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientReportsPage]
})
export class ClientReportsPageModule {}
