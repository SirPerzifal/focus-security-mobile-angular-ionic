import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentPollingPageRoutingModule } from './resident-polling-routing.module';

import { ResidentPollingPage } from './resident-polling.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentPollingPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ResidentPollingPage]
})
export class ResidentPollingPageModule {}
