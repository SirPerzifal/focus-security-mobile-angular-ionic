import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PollingMainPageRoutingModule } from './polling-main-routing.module';

import { PollingMainPage } from './polling-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PollingMainPageRoutingModule
  ],
  declarations: [PollingMainPage]
})
export class PollingMainPageModule {}
