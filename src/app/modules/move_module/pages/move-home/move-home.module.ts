import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoveHomePageRoutingModule } from './move-home-routing.module';

import { MoveHomePage } from './move-home.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MoveHomePageRoutingModule,
    SharedModule
  ],
  declarations: [MoveHomePage]
})
export class MoveHomePageModule {}
