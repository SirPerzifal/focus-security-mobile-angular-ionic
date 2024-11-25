import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentMyFamilyPageRoutingModule } from './resident-my-family-routing.module';

import { ResidentMyFamilyPage } from './resident-my-family.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentMyFamilyPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ResidentMyFamilyPage]
})
export class ResidentMyFamilyPageModule {}
