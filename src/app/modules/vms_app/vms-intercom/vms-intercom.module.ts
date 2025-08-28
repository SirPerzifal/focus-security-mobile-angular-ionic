import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VmsIntercomPageRoutingModule } from './vms-intercom-routing.module';

import { VmsIntercomPage } from './vms-intercom.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VmsIntercomPageRoutingModule,
    ComponentsModule,
    SharedModule,
  ],
  declarations: [VmsIntercomPage]
})
export class VmsIntercomPageModule {}
