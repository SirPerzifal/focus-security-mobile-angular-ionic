import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BicycleTagApplicationPageRoutingModule } from './bicycle-tag-application-routing.module';

import { BicycleTagApplicationPage } from './bicycle-tag-application.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BicycleTagApplicationPageRoutingModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [BicycleTagApplicationPage]
})
export class BicycleTagApplicationPageModule {}
