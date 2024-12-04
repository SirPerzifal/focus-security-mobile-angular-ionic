import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalkInPageRoutingModule } from './walk-in-routing.module';

import { WalkInPage } from './walk-in.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalkInPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [WalkInPage]
})
export class WalkInPageModule {}
