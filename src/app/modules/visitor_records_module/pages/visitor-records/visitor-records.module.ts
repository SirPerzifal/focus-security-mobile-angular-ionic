import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitorRecordsPageRoutingModule } from './visitor-records-routing.module';

import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { VisitorRecordsPage } from './visitor-records.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SharedModule,
    VisitorRecordsPageRoutingModule
  ],
  declarations: [VisitorRecordsPage]
})
export class VisitorRecordsPageModule {}
