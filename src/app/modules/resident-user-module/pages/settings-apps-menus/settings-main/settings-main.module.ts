import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsMainPageRoutingModule } from './settings-main-routing.module';

import { SettingsMainPage } from './settings-main.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsMainPageRoutingModule,
    SharedModule
  ],
  declarations: [SettingsMainPage]
})
export class SettingsMainPageModule {}
