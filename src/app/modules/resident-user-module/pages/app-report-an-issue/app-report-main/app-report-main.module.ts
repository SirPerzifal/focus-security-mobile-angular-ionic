import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppReportMainPageRoutingModule } from './app-report-main-routing.module';

import { AppReportMainPage } from './app-report-main.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppReportMainPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [AppReportMainPage]
})
export class AppReportMainPageModule {}
