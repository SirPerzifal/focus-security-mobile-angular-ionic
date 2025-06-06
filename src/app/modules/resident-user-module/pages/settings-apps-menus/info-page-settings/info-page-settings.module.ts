import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoPageSettingsPageRoutingModule } from './info-page-settings-routing.module';

import { InfoPageSettingsPage } from './info-page-settings.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoPageSettingsPageRoutingModule,
    SharedModule
  ],
  declarations: [InfoPageSettingsPage]
})
export class InfoPageSettingsPageModule {}
