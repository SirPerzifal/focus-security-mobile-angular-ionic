import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordsAlertNextPageRoutingModule } from './records-alert-next-routing.module';

import { RecordsAlertNextPage } from './records-alert-next.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordsAlertNextPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [RecordsAlertNextPage]
})
export class RecordsAlertNextPageModule {}
