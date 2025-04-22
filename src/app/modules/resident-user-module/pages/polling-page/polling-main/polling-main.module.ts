import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PollingMainPageRoutingModule } from './polling-main-routing.module';

import { PollingMainPage } from './polling-main.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PollingMainPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [PollingMainPage]
})
export class PollingMainPageModule {}
