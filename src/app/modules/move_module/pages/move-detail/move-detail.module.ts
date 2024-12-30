import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoveDetailPageRoutingModule } from './move-detail-routing.module';

import { MoveDetailPage } from './move-detail.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MoveHomePage } from '../move-home/move-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoveDetailPageRoutingModule,
    ComponentsModule,
    SharedModule,
    
  ],
  declarations: [MoveDetailPage],
  providers: [MoveHomePage]
})
export class MoveDetailPageModule {}
