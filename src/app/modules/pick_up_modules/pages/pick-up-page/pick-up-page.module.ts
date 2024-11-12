import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickUpPagePageRoutingModule } from './pick-up-page-routing.module';

import { PickUpPagePage } from './pick-up-page.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickUpPagePageRoutingModule,
    ComponentsModule,
    SharedModule,
    FontAwesomeModule
  ],
  declarations: [PickUpPagePage]
})
export class PickUpPagePageModule {}
