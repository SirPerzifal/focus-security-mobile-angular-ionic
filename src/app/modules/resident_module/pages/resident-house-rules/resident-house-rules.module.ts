import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentHouseRulesPageRoutingModule } from './resident-house-rules-routing.module';

import { ResidentHouseRulesPage } from './resident-house-rules.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentHouseRulesPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ResidentHouseRulesPage]
})
export class ResidentHouseRulesPageModule {}
