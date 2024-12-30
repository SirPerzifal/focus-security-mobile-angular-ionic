import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentReportAnIssuePageRoutingModule } from './resident-report-an-issue-routing.module';

import { ResidentReportAnIssuePage } from './resident-report-an-issue.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentReportAnIssuePageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ResidentReportAnIssuePage]
})
export class ResidentReportAnIssuePageModule {}
