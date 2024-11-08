import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickUpPagePageRoutingModule } from './pick-up-page-routing.module';

import { ComponentsModule } from 'src/app/shared/components/component.module';
import { PickUpPagePage } from './pick-up-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickUpPagePageRoutingModule,
    ComponentsModule
  ],
  declarations: [PickUpPagePage]
})
export class PickUpPagePageModule {}
