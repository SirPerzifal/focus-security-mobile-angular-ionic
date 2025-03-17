import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientHouseRulesPageRoutingModule } from './client-house-rules-routing.module';

import { ClientHouseRulesPage } from './client-house-rules.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientHouseRulesPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ClientHouseRulesPage]
})
export class ClientHouseRulesPageModule {}
