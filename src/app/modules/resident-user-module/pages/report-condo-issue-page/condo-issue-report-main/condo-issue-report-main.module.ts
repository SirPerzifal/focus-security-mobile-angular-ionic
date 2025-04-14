import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CondoIssueReportMainPageRoutingModule } from './condo-issue-report-main-routing.module';

import { CondoIssueReportMainPage } from './condo-issue-report-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CondoIssueReportMainPageRoutingModule
  ],
  declarations: [CondoIssueReportMainPage]
})
export class CondoIssueReportMainPageModule {}
