import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordAppReportPageRoutingModule } from './record-app-report-routing.module';

import { RecordAppReportPage } from './record-app-report.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordAppReportPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [RecordAppReportPage]
})
export class RecordAppReportPageModule {}
