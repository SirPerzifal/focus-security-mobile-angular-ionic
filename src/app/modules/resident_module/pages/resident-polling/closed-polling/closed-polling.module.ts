import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClosedPollingPageRoutingModule } from './closed-polling-routing.module';

import { ClosedPollingPage } from './closed-polling.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClosedPollingPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClosedPollingPage]
})
export class ClosedPollingPageModule {}
