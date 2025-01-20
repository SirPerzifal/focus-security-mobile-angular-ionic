import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsResidentsPageRoutingModule } from './records-residents-routing.module';

import { RecordsResidentsPage } from './records-residents.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsResidentsPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [RecordsResidentsPage]
})
export class RecordsResidentsPageModule {}
