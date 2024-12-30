import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentReportAnAppIssuePageRoutingModule } from './resident-report-an-app-issue-routing.module';

import { ResidentReportAnAppIssuePage } from './resident-report-an-app-issue.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentReportAnAppIssuePageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ResidentReportAnAppIssuePage]
})
export class ResidentReportAnAppIssuePageModule {}
