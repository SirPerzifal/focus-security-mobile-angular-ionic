import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertMainPageRoutingModule } from './alert-main-routing.module';

import { AlertMainPage } from './alert-main.page';
import { ComponentsModule } from 'src/app/shared/components/component.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertMainPageRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  declarations: [AlertMainPage]
})
export class AlertMainPageModule {}
