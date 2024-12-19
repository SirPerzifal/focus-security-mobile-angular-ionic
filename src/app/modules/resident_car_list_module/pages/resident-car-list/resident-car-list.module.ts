import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentCarListPageRoutingModule } from './resident-car-list-routing.module';

import { ResidentCarListPage } from './resident-car-list.page';

import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentCarListPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [ResidentCarListPage]
})
export class ResidentCarListPageModule {}
