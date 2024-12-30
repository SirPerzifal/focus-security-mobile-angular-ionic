import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RenovationHomePageRoutingModule } from './renovation-home-routing.module';

import { RenovationHomePage } from './renovation-home.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RenovationHomePageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [RenovationHomePage]
})
export class RenovationHomePageModule {}
