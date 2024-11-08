import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalkInPageRoutingModule } from './walk-in-routing.module';

import { WalkInPage } from './walk-in.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalkInPageRoutingModule,
    ComponentsModule
  ],
  declarations: [WalkInPage]
})
export class WalkInPageModule {}
