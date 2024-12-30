import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentSettingsPagePageRoutingModule } from './resident-settings-page-routing.module';

import { ResidentSettingsPagePage } from './resident-settings-page.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentSettingsPagePageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ResidentSettingsPagePage]
})
export class ResidentSettingsPagePageModule {}
